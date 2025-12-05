package com.agromarket.gateway.files;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class UploadController {

  @Value("${app.upload.dir:uploads}")
  private String uploadDir;

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Mono<ResponseEntity<Map<String, String>>> upload(@RequestPart("file") FilePart filePart) {
    try {
      Files.createDirectories(Path.of(uploadDir));
      String ext = "";
      String name = filePart.filename();
      int i = name.lastIndexOf('.');
      if (i > -1) ext = name.substring(i);
      String lower = ext.toLowerCase();
      if (!(lower.equals(".png") || lower.equals(".jpg") || lower.equals(".jpeg") || lower.equals(".webp"))) {
        return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "unsupported_format")));
      }
      String newName = Instant.now().toEpochMilli() + ext;
      Path target = Paths.get(uploadDir, newName);
      String url = "/uploads/" + newName;
      return filePart.transferTo(target)
        .then(Mono.just(ResponseEntity.ok(Map.of("url", url))))
        .onErrorResume(ex -> Mono.just(ResponseEntity.internalServerError().body(Map.of("error", "upload_failed"))));
    } catch (Exception e) {
      return Mono.just(ResponseEntity.internalServerError().body(Map.of("error", "upload_failed")));
    }
  }

  @PostMapping(value = "/upload/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Mono<ResponseEntity<Map<String, String>>> uploadVideo(@RequestPart("file") FilePart filePart) {
    try {
      Path videosDir = Paths.get(uploadDir, "videos");
      Files.createDirectories(videosDir);
      String ext = "";
      String name = filePart.filename();
      int i = name.lastIndexOf('.');
      if (i > -1) ext = name.substring(i);
      String lower = ext.toLowerCase();
      if (!(lower.equals(".mp4"))) {
        return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "unsupported_format")));
      }
      String newName = Instant.now().toEpochMilli() + ext;
      Path target = videosDir.resolve(newName);
      String url = "/uploads/videos/" + newName;
      return filePart.transferTo(target)
        .then(Mono.just(ResponseEntity.ok(Map.of("url", url))))
        .onErrorResume(ex -> Mono.just(ResponseEntity.internalServerError().body(Map.of("error", "upload_failed"))));
    } catch (Exception e) {
      return Mono.just(ResponseEntity.internalServerError().body(Map.of("error", "upload_failed")));
    }
  }
}
