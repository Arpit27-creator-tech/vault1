import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models.dart';
import '../theme.dart';

class ScientistLabWidget extends StatefulWidget {
  final bool isSolved;
  final VoidCallback onSolved;

  const ScientistLabWidget({
    super.key,
    required this.isSolved,
    required this.onSolved,
  });

  @override
  State<ScientistLabWidget> createState() => _ScientistLabWidgetState();
}

class _ScientistLabWidgetState extends State<ScientistLabWidget> {
  int _coeffA = 1; // Target: 2
  int _coeffB = 1; // Target: 3
  int _coeffC = 1; // Target: 1
  double _ph = 4.5; // Target: 7.2

  bool get _isBalanced =>
      _coeffA == 2 && _coeffB == 3 && _coeffC == 1 && (_ph - 7.2).abs() <= 0.6;

  void _synthesize() {
    if (_isBalanced) {
      widget.onSolved();
    } else {
      String reason = '';
      if (_coeffA != 2 || _coeffB != 3 || _coeffC != 1) {
        reason =
            'Stoichiometric ratio unbalanced! Incomplete reaction detected.';
      } else {
        reason =
            'pH buffer level unstable! Solution must be neutralized to ~7.2.';
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

  Color _getFlaskColor() {
    if (widget.isSolved || _isBalanced) return VaultColors.hackerGreen;
    if (_ph < 5.0) return Colors.purpleAccent;
    if (_ph < 7.0) return Colors.amber;
    if (_ph <= 8.0) return VaultColors.scientistCyan;
    return Colors.blueAccent;
  }

  @override
  Widget build(BuildContext context) {
    const role = OperativeRole.scientist;

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
                  'BIOCHEMICAL LAB // ${role.codeName}',
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
                          'SYNTHESIS STABILIZED (pH 7.2)',
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
                  'OBJECTIVE: SYNTHESIZE NEUTRALIZATION BUFFER',
                  style: GoogleFonts.orbitron(
                    color: role.color,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Equilibrate molar coefficients (2A + 3B → 1C) and calibrate pH to 7.2 to dissolve the biological vault membrane.',
                  style: TextStyle(
                    color: VaultColors.textSecondary,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 16),

                // Reaction Status & Flask Indicator
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF03070E),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: VaultColors.border),
                  ),
                  child: Row(
                    children: [
                      // Animated Flask Icon / Glow
                      Container(
                        width: 46,
                        height: 46,
                        decoration: BoxDecoration(
                          color: _getFlaskColor().withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                          border: Border.all(color: _getFlaskColor(), width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: _getFlaskColor().withValues(alpha: 0.4),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.science_rounded,
                          color: _getFlaskColor(),
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'FORMULA EQUATION:',
                              style: GoogleFonts.jetBrainsMono(
                                color: VaultColors.textMuted,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${_coeffA}A (Acid) + ${_coeffB}B (Base) ➔ ${_coeffC}C (Compound)',
                              style: GoogleFonts.jetBrainsMono(
                                color: VaultColors.textPrimary,
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Status: ${_isBalanced || widget.isSolved ? "STABLE EQUILIBRIUM" : "REACTING / UNSTABLE"}',
                              style: GoogleFonts.jetBrainsMono(
                                color: _isBalanced || widget.isSolved
                                    ? VaultColors.hackerGreen
                                    : VaultColors.warningOrange,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Reagent Controls
                Row(
                  children: [
                    _buildReagentBox(
                      'REAGENT A',
                      _coeffA,
                      (v) => setState(() => _coeffA = v),
                      2,
                    ),
                    const SizedBox(width: 8),
                    _buildReagentBox(
                      'REAGENT B',
                      _coeffB,
                      (v) => setState(() => _coeffB = v),
                      3,
                    ),
                    const SizedBox(width: 8),
                    _buildReagentBox(
                      'CATALYST C',
                      _coeffC,
                      (v) => setState(() => _coeffC = v),
                      1,
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // pH Buffer Slider
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: VaultColors.panelElevated,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: (_ph - 7.2).abs() <= 0.6
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
                            'BUFFER pH TITRATION (Target: 7.2)',
                            style: GoogleFonts.jetBrainsMono(
                              color: VaultColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'pH ${_ph.toStringAsFixed(1)}',
                            style: GoogleFonts.jetBrainsMono(
                              color: (_ph - 7.2).abs() <= 0.6
                                  ? VaultColors.hackerGreen
                                  : role.color,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                      Slider(
                        value: _ph,
                        min: 1.0,
                        max: 14.0,
                        activeColor: role.color,
                        inactiveColor: VaultColors.border,
                        onChanged: widget.isSolved
                            ? null
                            : (v) => setState(() => _ph = v),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Synthesis Button
                ElevatedButton.icon(
                  onPressed: widget.isSolved ? null : _synthesize,
                  icon: const Icon(Icons.bubble_chart_rounded, size: 18),
                  label: Text(
                    widget.isSolved
                        ? 'COMPOUND SYNTHESIS CONFIRMED'
                        : 'INITIATE SYNTHESIS REACTION',
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

  Widget _buildReagentBox(
    String label,
    int count,
    Function(int) onChange,
    int target,
  ) {
    final isMatched = count == target;

    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: VaultColors.panelElevated,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isMatched ? VaultColors.hackerGreen : VaultColors.border,
          ),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: GoogleFonts.jetBrainsMono(
                color: VaultColors.textMuted,
                fontSize: 9,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '$count mol',
              style: GoogleFonts.jetBrainsMono(
                color: isMatched
                    ? VaultColors.hackerGreen
                    : VaultColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                InkWell(
                  onTap: widget.isSolved || count <= 1
                      ? null
                      : () => onChange(count - 1),
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: VaultColors.panel,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Icon(
                      Icons.remove,
                      size: 14,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  onTap: widget.isSolved || count >= 5
                      ? null
                      : () => onChange(count + 1),
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: VaultColors.panel,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Icon(Icons.add, size: 14, color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
