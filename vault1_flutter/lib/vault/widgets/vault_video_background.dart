// ignore_for_file: avoid_web_libraries_in_flutter
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// Conditional import for web
import 'dart:ui_web' as ui_web;
// ignore: deprecated_member_use
import 'dart:html' as html;

class VaultVideoBackground extends StatefulWidget {
  final Widget child;

  const VaultVideoBackground({
    super.key,
    required this.child,
  });

  @override
  State<VaultVideoBackground> createState() => _VaultVideoBackgroundState();
}

class _VaultVideoBackgroundState extends State<VaultVideoBackground> {
  static bool _viewRegistered = false;
  static const String _viewType = 'vault-bg-video-view';

  @override
  void initState() {
    super.initState();
    if (kIsWeb && !_viewRegistered) {
      ui_web.platformViewRegistry.registerViewFactory(_viewType, (int viewId) {
        final video = html.VideoElement()
          ..autoplay = true
          ..loop = true
          ..muted = true
          ..setAttribute('muted', '')
          ..setAttribute('autoplay', '')
          ..setAttribute('playsinline', '')
          ..setAttribute('webkit-playsinline', '')
          ..setAttribute('preload', 'auto')
          ..style.width = '100%'
          ..style.height = '100%'
          ..style.objectFit = 'cover'
          ..style.filter = 'brightness(1.05) contrast(1.05) saturate(1.15)'
          ..style.pointerEvents = 'none';

        final candidatePaths = [
          'backgroundnew.mp4',
          '/backgroundnew.mp4',
          'assets/videos/backgroundnew.mp4',
          'assets/assets/videos/backgroundnew.mp4',
          'nature.mp4',
          '/nature.mp4',
        ];

        int currentPathIndex = 0;
        video.src = candidatePaths[currentPathIndex];

        video.onError.listen((_) {
          currentPathIndex++;
          if (currentPathIndex < candidatePaths.length) {
            video.src = candidatePaths[currentPathIndex];
            video.load();
            video.play().catchError((_) {});
          }
        });

        // Ensure video is played on load
        video.onCanPlay.listen((_) {
          video.play().catchError((_) {});
        });
        video.play().catchError((_) {});

        // Unlock autoplay on user click or touch anywhere in the window
        void unlockAutoplay(html.Event _) {
          if (video.paused) {
            video.play().catchError((_) {});
          }
        }

        html.window.onClick.listen(unlockAutoplay);
        html.window.onTouchStart.listen(unlockAutoplay);

        return video;
      });
      _viewRegistered = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Background Video (Web)
        if (kIsWeb)
          const Positioned.fill(
            child: IgnorePointer(
              child: HtmlElementView(viewType: _viewType),
            ),
          )
        else
          // Dynamic cyber animated gradient for non-web preview targets
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.topCenter,
                  radius: 1.4,
                  colors: [
                    Color(0xFF0C3826),
                    Color(0xFF062417),
                    Color(0xFF020C07),
                  ],
                ),
              ),
            ),
          ),

        // Subtle Original Cyber Emerald Vignette / Overlay (matching App.jsx opacity)
        Positioned.fill(
          child: IgnorePointer(
            child: Container(
              color: const Color(
                0x33051811,
              ), // 20% opacity so video shines through
            ),
          ),
        ),

        // Forefront Content
        widget.child,
      ],
    );
  }
}
