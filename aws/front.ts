// USE in Frontend
export async function uploadS3(file: File, presignedUrl: string) {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    if (!response.ok) {
        throw new Error('Failed to upload file');
    }
}
