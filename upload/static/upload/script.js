// upload/static/upload/script.js
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileListContent = document.getElementById('fileListContent');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    const clearButton = document.getElementById('clearButton'); 
    const noFilesMessage = document.getElementById('noFilesMessage');


    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(event) {
        event.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(event) {
        event.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        uploadFiles(files);
    });

    // Handle file input change
    fileInput.addEventListener('change', function() {
        const files = fileInput.files;
        uploadFiles(files);
    });

    function uploadFiles(files) {
        const formData = new FormData();
        for (const file of files) {
            formData.append('file', file);
        }
        formData.append('csrfmiddlewaretoken', csrfToken);

        fetch('/upload/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchFileList();  // Refresh file list
            } else {
                alert('Upload failed');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all uploaded files?')) {
            fetch('/upload/clear/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchFileList();  // Refresh file list
                } else {
                    alert('Failed to clear files');
                }
            })
            .catch(error => console.error('Error clearing files:', error));
        }
    });


    function fetchFileList() {
        fetch('/upload/files/')
        .then(response => response.json())
        .then(data => {
            fileListContent.innerHTML = '';  // Clear existing list
            
            if (data.files.length > 0) {
                clearButton.style.display = 'block';  // Show the clear button
                noFilesMessage.style.display = 'none';  // Hide the no files message

                data.files.forEach(file => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = file.url;
                    link.target = '_blank';
                    link.textContent = file.name;
                    listItem.appendChild(link);
                    fileListContent.appendChild(listItem);
                });
            } else {
                clearButton.style.display = 'none';  // Hide the clear button
                noFilesMessage.style.display = 'block';  // Show the no files message
            }
        })
        .catch(error => console.error('Error fetching file list:', error));
    }

    // Initial fetch of file list
    fetchFileList();
});
