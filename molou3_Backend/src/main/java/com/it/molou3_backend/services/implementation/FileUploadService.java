package com.it.molou3_backend.services.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Service
public class FileUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        // Convertir MultipartFile en File temporaire
        File tempFile = convertMultiPartToFile(file);

        try {
            // Uploader vers Cloudinary avec typage explicite
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.asMap(
                    "resource_type", "auto" // Détecte automatiquement le type (image, pdf, etc.)
            ));

            // Vérifier que l'URL existe et est une String
            Object url = uploadResult.get("url");
            if (!(url instanceof String)) {
                throw new IOException("URL invalide ou absente dans la réponse de Cloudinary");
            }

            return (String) url; // Retourner l'URL publique
        } catch (IOException e) {
            throw new IOException("Erreur lors de l'upload vers Cloudinary : " + e.getMessage(), e);
        } finally {
            // Supprimer le fichier temporaire dans un bloc finally pour garantir l'exécution
            if (!tempFile.delete()) {
                // Loguer ou lancer une exception selon tes besoins
                throw new IOException("Impossible de supprimer le fichier temporaire : " + tempFile.getAbsolutePath());
            }
        }
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        String originalFilename = Objects.requireNonNull(file.getOriginalFilename(), "Le nom du fichier ne peut pas être null");
        File convFile = new File(originalFilename);

        // Utiliser try-with-resources pour fermer automatiquement le FileOutputStream
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }

        return convFile;
    }
}