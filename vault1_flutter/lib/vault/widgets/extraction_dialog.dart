import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models.dart';
import '../theme.dart';

class ExtractionDialog extends StatelessWidget {
  final Map<OperativeRole, bool> solvedMap;
  final VoidCallback onResetMission;

  const ExtractionDialog({
    super.key,
    required this.solvedMap,
    required this.onResetMission,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 520),
        decoration: BoxDecoration(
          color: VaultColors.panel,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: VaultColors.hackerGreen, width: 2),
          boxShadow: [
            BoxShadow(
              color: VaultColors.hackerGreen.withValues(alpha: 0.25),
              blurRadius: 30,
              spreadRadius: 5,
            ),
          ],
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Safe Breach Badge
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                color: VaultColors.hackerGreen.withValues(alpha: 0.15),
                shape: BoxShape.circle,
                border: Border.all(color: VaultColors.hackerGreen, width: 2),
              ),
              child: const Icon(
                Icons.lock_open_rounded,
                color: VaultColors.hackerGreen,
                size: 38,
              ),
            ),
            const SizedBox(height: 16),

            Text(
              'VAULT BREACH SUCCESSFUL',
              style: GoogleFonts.orbitron(
                color: VaultColors.hackerGreen,
                fontSize: 18,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              'MISSION COMPLETED // CODE: BLACKOUT-7',
              style: GoogleFonts.jetBrainsMono(
                color: VaultColors.textSecondary,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 20),

            // Interlocked Clues Summary
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF03070E),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: VaultColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'SYNTHESIZED SQUAD INTELLIGENCE:',
                    style: GoogleFonts.jetBrainsMono(
                      color: VaultColors.textMuted,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  _buildClueRow(OperativeRole.hacker, '0x7F_KAPPA'),
                  _buildClueRow(OperativeRole.engineer, '142.5 MHz'),
                  _buildClueRow(OperativeRole.scientist, 'pH 7.2 NEUTRALIZED'),
                  _buildClueRow(OperativeRole.cryptographer, 'PROMETHEUS'),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Mission Stats
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('TEAM XP', '+2,400 XP', VaultColors.hackerGreen),
                _buildStatItem(
                  'SECURITY LEVEL',
                  'OVERRIDDEN',
                  VaultColors.scientistCyan,
                ),
                _buildStatItem(
                  'EXTRACTION',
                  'SECURED',
                  VaultColors.engineerAmber,
                ),
              ],
            ),

            const SizedBox(height: 24),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      onResetMission();
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: VaultColors.textSecondary,
                      side: BorderSide(color: VaultColors.border),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      'RESET OPERATION',
                      style: GoogleFonts.jetBrainsMono(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: VaultColors.hackerGreen,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      'DISMISS HUD',
                      style: GoogleFonts.jetBrainsMono(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClueRow(OperativeRole role, String clue) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Icon(role.icon, color: role.color, size: 14),
          const SizedBox(width: 8),
          Text(
            '${role.name.toUpperCase()}:',
            style: GoogleFonts.jetBrainsMono(
              color: role.color,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Spacer(),
          Text(
            clue,
            style: GoogleFonts.jetBrainsMono(
              color: VaultColors.textPrimary,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String title, String value, Color color) {
    return Column(
      children: [
        Text(
          title,
          style: GoogleFonts.jetBrainsMono(
            color: VaultColors.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.orbitron(
            color: color,
            fontSize: 13,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
