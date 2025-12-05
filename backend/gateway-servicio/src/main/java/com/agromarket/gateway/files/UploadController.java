package com.agromarket.gateway.files;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;

@Controller
@RequestMapping("/api/files")
public class UploadController {

  @Value("${app.upload.dir:uploads}")
  private String uploadDir;

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Mono<ResponseEntity<String>> upload(@RequestPart("file") FilePart filePart) {
    return Mono.fromSupplier(() -> {
      try {
        Files.createDirectories(Path.of(uploadDir));
        String ext = "";
        String name = filePart.filename();
        int i = name.lastIndexOf('.');
        if (i > -1) ext = name.substring(i);
        String newName = Instant.now().toEpochMilli() + ext;
        Path target = Paths.get(uploadDir, newName);
        // block to write file; small files acceptable for demo
        filePart.transferTo(target).block();
        String url = "/uploads/" + newName;
        return ResponseEntity.ok("{\"url\":\"" + url + "\"}");
      } catch (Exception e) {
        return ResponseEntity.internalServerError().body("{\"error\":\"upload_failed\"}");
      }
    });
  }
}

