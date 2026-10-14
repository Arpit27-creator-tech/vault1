import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models.dart';
import '../theme.dart';

class CryptographerDeckWidget extends StatefulWidget {
  final bool isSolved;
  final VoidCallback onSolved;

  const CryptographerDeckWidget({
    super.key,
    required this.isSolved,
    required this.onSolved,
  });

  @override
  State<CryptographerDeckWidget> createState() =>
      _CryptographerDeckWidgetState();
}

class _CryptographerDeckWidgetState extends State<CryptographerDeckWidget> {
  double _frequency = 98.0; // Target is 142.5 MHz
  int _caesarShift = 0; // Target is 3

  static const String _ciphertext = 'SURPHWKHXV'; // PROMETHEUS shifted by +3

  bool get _isFreqLocked => (_frequency - 142.5).abs() <= 1.0;
  bool get _isShiftSolved => _caesarShift == 3;

  String get _decryptedPreview {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return _ciphertext.split('').map((char) {
      final idx = chars.indexOf(char);
      if (idx == -1) return char;
      final newIdx = (idx - _caesarShift + 26) % 26;
      return chars[newIdx];
    }).join();
  }

  void _transmitKey() {
    if (_isFreqLocked && _isShiftSolved) {
      widget.onSolved();
    } else {
      String reason = '';
      if (!_isFreqLocked) {
        reason =
            'Radio frequency out of range! Tune antenna to lock carrier signal (~142.5 MHz).';
      } else {
        reason =
            'Cipher key mismatch! Shift wheel rotation does not produce correct keyword.';
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: VaultColors.alarmRed,
          content: Text(
            reason,
            style: GoogleFonts.jetBrainsMono(color: Colors.white, fontSize: 12),
          ),
          duration: const Duration(milliseconds: 500),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const role = OperativeRole.cryptographer;

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
                  'CIPHER DECK // ${role.codeName}',
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
                          'CIPHER CRACKED: PROMETHEUS',
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
                  'OBJECTIVE: INTERCEPT & DECODE MILITARY CIPHER',
                  style: GoogleFonts.orbitron(
                    color: role.color,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Lock onto 142.5 MHz carrier frequency and rotate the Caesar shift wheel to decrypt the master passcode.',
                  style: TextStyle(
                    color: VaultColors.textSecondary,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 16),

                // Radio Frequency Tuner Box
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF03070E),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _isFreqLocked
                          ? VaultColors.hackerGreen
                          : VaultColors.border,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.radio_rounded,
                                color: _isFreqLocked
                                    ? VaultColors.hackerGreen
                                    : role.color,
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'CARRIER FREQUENCY',
                                style: GoogleFonts.jetBrainsMono(
                                  color: VaultColors.textSecondary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            _isFreqLocked
                                ? 'SIGNAL LOCKED [142.5 MHz]'
                                : '${_frequency.toStringAsFixed(1)} MHz',
                            style: GoogleFonts.jetBrainsMono(
                              color: _isFreqLocked
                                  ? VaultColors.hackerGreen
                                  : role.color,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Slider(
                        value: _frequency,
                        min: 80.0,
                        max: 180.0,
                        activeColor: _isFreqLocked
                            ? VaultColors.hackerGreen
                            : role.color,
                        inactiveColor: VaultColors.border,
                        onChanged: widget.isSolved
                            ? null
                            : (v) => setState(() => _frequency = v),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Intercepted Cipher Display
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: VaultColors.panelElevated,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: VaultColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'INTERCEPTED CIPHERTEXT:',
                        style: GoogleFonts.jetBrainsMono(
                          color: VaultColors.textMuted,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _ciphertext,
                        style: GoogleFonts.jetBrainsMono(
                          color: VaultColors.cryptoPurple,
                          fontSize: 20,
                          letterSpacing: 4,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Divider(color: VaultColors.border, height: 20),
                      Text(
                        'REAL-TIME DECRYPTION PREVIEW:',
                        style: GoogleFonts.jetBrainsMono(
                          color: VaultColors.textMuted,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _decryptedPreview,
                        style: GoogleFonts.jetBrainsMono(
                          color: _isShiftSolved
                              ? VaultColors.hackerGreen
                              : VaultColors.textPrimary,
                          fontSize: 22,
                          letterSpacing: 4,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Caesar Shift Wheel Controls
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: VaultColors.panelElevated,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: _isShiftSolved
                          ? VaultColors.hackerGreen
                          : VaultColors.border,
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(
                        'CAESAR SHIFT (ROT):',
                        style: GoogleFonts.jetBrainsMono(
                          color: VaultColors.textSecondary,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: widget.isSolved || _caesarShift <= 0
                            ? null
                            : () => setState(() => _caesarShift--),
                        icon: const Icon(Icons.remove_circle_outline, size: 18),
                        color: role.color,
                      ),
                      Text(
                        '$_caesarShift',
                        style: GoogleFonts.jetBrainsMono(
                          color: _isShiftSolved
                              ? VaultColors.hackerGreen
                              : role.color,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        onPressed: widget.isSolved || _caesarShift >= 12
                            ? null
                            : () => setState(() => _caesarShift++),
                        icon: const Icon(Icons.add_circle_outline, size: 18),
                        color: role.color,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Transmit Key Button
                ElevatedButton.icon(
                  onPressed: widget.isSolved ? null : _transmitKey,
                  icon: const Icon(Icons.vpn_key_rounded, size: 18),
                  label: Text(
                    widget.isSolved
                        ? 'CIPHER CODE ACCEPTED'
                        : 'TRANSMIT DECRYPTED KEY',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: role.color,
                    foregroundColor: Colors.white,
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
