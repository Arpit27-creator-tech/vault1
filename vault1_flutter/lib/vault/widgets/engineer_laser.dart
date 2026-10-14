import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models.dart';
import '../theme.dart';

class EngineerLaserGridWidget extends StatefulWidget {
  final bool isSolved;
  final VoidCallback onSolved;

  const EngineerLaserGridWidget({
    super.key,
    required this.isSolved,
    required this.onSolved,
  });

  @override
  State<EngineerLaserGridWidget> createState() =>
      _EngineerLaserGridWidgetState();
}

class _EngineerLaserGridWidgetState extends State<EngineerLaserGridWidget> {
  double _angleA = 20.0; // Target is 45
  double _angleB = 90.0; // Target is 135

  bool get _isTargetAligned =>
      (_angleA - 45).abs() <= 5 && (_angleB - 135).abs() <= 5;

  void _engageBeam() {
    if (_isTargetAligned) {
      widget.onSolved();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: VaultColors.alarmRed,
          content: Text(
            'BEAM MISALIGNED! Security sensor deflection angle out of tolerance range.',
            style: GoogleFonts.jetBrainsMono(color: Colors.white, fontSize: 12),
          ),
          duration: const Duration(milliseconds: 500),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const role = OperativeRole.engineer;

    return Container(
      decoration: BoxDecoration(
        color: VaultColors.panel,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: widget.isSolved ? role.color : VaultColors.borderGlow,
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (widget.isSolved ? role.color : Colors.transparent)
                .withValues(alpha: 0.15),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: VaultColors.panelElevated,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(15),
              ),
              border: Border(bottom: BorderSide(color: VaultColors.border)),
            ),
            child: Row(
              children: [
                Icon(role.icon, color: role.color, size: 18),
                const SizedBox(width: 8),
                Text(
                  'OPTICS CALIBRATION // ${role.codeName}',
                  style: GoogleFonts.jetBrainsMono(
                    color: VaultColors.textPrimary,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const Spacer(),
                if (widget.isSolved)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: role.color.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: role.color),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.check_circle_rounded,
                          color: role.color,
                          size: 14,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'OPTICS LOCKED (142.5 MHz)',
                          style: GoogleFonts.jetBrainsMono(
                            color: role.color,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'OBJECTIVE: ALIGN LASER REFRACTION MATRIX',
                  style: GoogleFonts.orbitron(
                    color: role.color,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Rotate Mirror Alpha and Mirror Beta to guide the photon beam across the chamber into the quantum receiver.',
                  style: TextStyle(
                    color: VaultColors.textSecondary,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 16),

                // Interactive Laser Chamber Canvas
                Container(
                  height: 160,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: const Color(0xFF03060B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _isTargetAligned || widget.isSolved
                          ? role.color.withValues(alpha: 0.6)
                          : VaultColors.border,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: CustomPaint(
                      painter: _LaserChamberPainter(
                        angleA: _angleA,
                        angleB: _angleB,
                        isAligned: _isTargetAligned || widget.isSolved,
                        accentColor: role.color,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Sliders for Mirror A and Mirror B
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: VaultColors.panelElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: (_angleA - 45).abs() <= 5
                                ? VaultColors.hackerGreen
                                : VaultColors.border,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'MIRROR ALPHA (Target: 45°)',
                                  style: GoogleFonts.jetBrainsMono(
                                    color: VaultColors.textSecondary,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${_angleA.toInt()}°',
                                  style: GoogleFonts.jetBrainsMono(
                                    color: (_angleA - 45).abs() <= 5
                                        ? VaultColors.hackerGreen
                                        : role.color,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                            Slider(
                              value: _angleA,
                              min: 0,
                              max: 90,
                              activeColor: role.color,
                              inactiveColor: VaultColors.border,
                              onChanged: widget.isSolved
                                  ? null
                                  : (v) => setState(() => _angleA = v),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: VaultColors.panelElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: (_angleB - 135).abs() <= 5
                                ? VaultColors.hackerGreen
                                : VaultColors.border,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'MIRROR BETA (Target: 135°)',
                                  style: GoogleFonts.jetBrainsMono(
                                    color: VaultColors.textSecondary,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${_angleB.toInt()}°',
                                  style: GoogleFonts.jetBrainsMono(
                                    color: (_angleB - 135).abs() <= 5
                                        ? VaultColors.hackerGreen
                                        : role.color,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                            Slider(
                              value: _angleB,
                              min: 90,
                              max: 180,
                              activeColor: role.color,
                              inactiveColor: VaultColors.border,
                              onChanged: widget.isSolved
                                  ? null
                                  : (v) => setState(() => _angleB = v),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Engagement Button
                ElevatedButton.icon(
                  onPressed: widget.isSolved ? null : _engageBeam,
                  icon: const Icon(Icons.flash_on_rounded, size: 18),
                  label: Text(
                    widget.isSolved
                        ? 'OPTICAL SENSOR ENGAGED'
                        : 'ENGAGE HIGH-FLUX BEAM',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: role.color,
                    foregroundColor: Colors.black,
                    minimumSize: const Size(double.infinity, 44),
                    textStyle: GoogleFonts.jetBrainsMono(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _LaserChamberPainter extends CustomPainter {
  final double angleA;
  final double angleB;
  final bool isAligned;
  final Color accentColor;

  _LaserChamberPainter({
    required this.angleA,
    required this.angleB,
    required this.isAligned,
    required this.accentColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = const Color(0xFF131D31)
      ..strokeWidth = 1.0;

    // Draw chamber grid
    for (double x = 0; x < size.width; x += 30) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += 30) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    final emitterPos = Offset(30, size.height / 2);
    final mirrorAPos = Offset(size.width * 0.35, size.height * 0.7);
    final mirrorBPos = Offset(size.width * 0.65, size.height * 0.3);
    final receptorPos = Offset(size.width - 30, size.height / 2);

    // Draw Emitter
    final emitterPaint = Paint()..color = const Color(0xFF38BDF8);
    canvas.drawCircle(emitterPos, 8, emitterPaint);
    canvas.drawCircle(
      emitterPos,
      12,
      emitterPaint
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );

    // Draw Receptor
    final receptorPaint = Paint()
      ..color = isAligned ? VaultColors.hackerGreen : VaultColors.alarmRed;
    canvas.drawRect(
      Rect.fromCenter(center: receptorPos, width: 18, height: 26),
      receptorPaint,
    );

    // Draw Mirror Alpha
    _drawMirror(canvas, mirrorAPos, angleA, "α");
    // Draw Mirror Beta
    _drawMirror(canvas, mirrorBPos, angleB, "β");

    // Draw Laser Beam
    final laserPaint = Paint()
      ..color = isAligned ? VaultColors.hackerGreen : accentColor
      ..strokeWidth = isAligned ? 3.5 : 2.0
      ..strokeCap = StrokeCap.round;

    final glowPaint = Paint()
      ..color = (isAligned ? VaultColors.hackerGreen : accentColor).withValues(
        alpha: 0.4,
      )
      ..strokeWidth = isAligned ? 10.0 : 6.0
      ..strokeCap = StrokeCap.round;

    final path = Path()..moveTo(emitterPos.dx, emitterPos.dy);

    path.lineTo(mirrorAPos.dx, mirrorAPos.dy);
    path.lineTo(mirrorBPos.dx, mirrorBPos.dy);

    if (isAligned) {
      path.lineTo(receptorPos.dx, receptorPos.dy);
    } else {
      // Deflect off target
      final deflectEnd = Offset(
        mirrorBPos.dx + 40,
        mirrorBPos.dy + (angleB > 135 ? 40 : -40),
      );
      path.lineTo(deflectEnd.dx, deflectEnd.dy);
    }

    canvas.drawPath(path, glowPaint);
    canvas.drawPath(path, laserPaint);
  }

  void _drawMirror(
    Canvas canvas,
    Offset center,
    double angleDeg,
    String label,
  ) {
    final rad = angleDeg * math.pi / 180;
    const length = 24.0;
    final p1 = Offset(
      center.dx - math.cos(rad) * length,
      center.dy - math.sin(rad) * length,
    );
    final p2 = Offset(
      center.dx + math.cos(rad) * length,
      center.dy + math.sin(rad) * length,
    );

    final mirrorPaint = Paint()
      ..color = const Color(0xFFE2E8F0)
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round;

    canvas.drawLine(p1, p2, mirrorPaint);

    final backingPaint = Paint()
      ..color = const Color(0xFF64748B)
      ..strokeWidth = 2.0;
    canvas.drawLine(
      Offset(p1.dx + 2, p1.dy + 2),
      Offset(p2.dx + 2, p2.dy + 2),
      backingPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _LaserChamberPainter oldDelegate) {
    return oldDelegate.angleA != angleA ||
        oldDelegate.angleB != angleB ||
        oldDelegate.isAligned != isAligned;
  }
}
