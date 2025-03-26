<?php
session_start();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Admin password - you should change this to a secure password
define('ADMIN_PASSWORD', 'admin');

// Log the request method and POST data
error_log('Request Method: ' . $_SERVER['REQUEST_METHOD']);
error_log('POST Data: ' . print_r($_POST, true));

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if this is a login attempt
    if (isset($_POST['password'])) {
        $submitted_password = $_POST['password'];
        error_log('Submitted password: ' . $submitted_password);
        error_log('Expected password: ' . ADMIN_PASSWORD);
        
        if ($submitted_password === ADMIN_PASSWORD) {
            $_SESSION['admin_logged_in'] = true;
            error_log('Login successful');
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
            exit;
        } else {
            error_log('Login failed - invalid password');
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid password']);
            exit;
        }
    }
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['images'])) {
    // Check if user is logged in
    if (!isset($_SESSION['admin_logged_in'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }

    $uploadDir = '../images/gallery/';
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $uploadedFiles = [];
    $errors = [];

    foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
        $file = [
            'name' => $_FILES['images']['name'][$key],
            'type' => $_FILES['images']['type'][$key],
            'tmp_name' => $tmp_name,
            'error' => $_FILES['images']['error'][$key],
            'size' => $_FILES['images']['size'][$key]
        ];

        // Validate file
        if ($file['error'] === UPLOAD_ERR_OK) {
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            if (!in_array($file['type'], $allowedTypes)) {
                $errors[] = "File {$file['name']} is not an allowed image type.";
                continue;
            }

            if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
                $errors[] = "File {$file['name']} exceeds the 5MB size limit.";
                continue;
            }

            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '.' . $extension;
            $targetPath = $uploadDir . $filename;

            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $uploadedFiles[] = [
                    'filename' => $filename,
                    'path' => '/images/gallery/' . $filename
                ];
            } else {
                $errors[] = "Failed to upload {$file['name']}.";
            }
        }
    }

    header('Content-Type: application/json');
    echo json_encode([
        'success' => count($uploadedFiles) > 0,
        'files' => $uploadedFiles,
        'errors' => $errors
    ]);
    exit;
}

// Get gallery images
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getGallery') {
    header('Content-Type: application/json');

    try {
        $galleryDir = __DIR__ . '/../images/gallery/';
        
        if (!file_exists($galleryDir)) {
            throw new Exception('Gallery directory not found');
        }

        $images = [];
        $files = scandir($galleryDir);

        if ($files === false) {
            throw new Exception('Failed to scan gallery directory');
        }

        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
                // Use relative path from the web root
                $images[] = [
                    'filename' => $file,
                    'path' => 'images/gallery/' . $file
                ];
            }
        }

        echo json_encode($images);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}
?> 