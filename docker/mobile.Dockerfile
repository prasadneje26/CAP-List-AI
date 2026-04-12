# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: docker/mobile.Dockerfile
# Note: Flutter mobile apps are built natively (Android Studio /
#       Xcode). This Dockerfile builds the Flutter web target,
#       which can serve as a progressive web app fallback.
# ============================================================

FROM ghcr.io/cirruslabs/flutter:stable AS builder
WORKDIR /app

COPY mobile-app/pubspec.yaml ./
RUN flutter pub get

COPY mobile-app/ .

# Build Flutter web
RUN flutter build web --release \
    --dart-define=API_URL=http://localhost/api

# Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/build/web /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; \
  location / { try_files $uri $uri/ /index.html; } }' \
  > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
