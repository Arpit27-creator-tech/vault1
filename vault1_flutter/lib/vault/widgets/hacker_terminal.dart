import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models.dart';
import '../theme.dart';

class HackerTerminalWidget extends StatefulWidget {
  final bool isSolved;
  final VoidCallback onSolved;

  const HackerTerminalWidget({
    super.key,
    required this.isSolved,
    required this.onSolved,
  });

  @override
  State<HackerTerminalWidget> createState() => _HackerTerminalWidgetState();
}

class _HackerTerminalWidgetState extends State<HackerTerminalWidget> {
  final TextEditingController _codeController = TextEditingController(
    text:
        '// VAULT SUBROUTINE BYPASS\n'
        'function filterPrimeNodes(nodes) {\n'
        '  return nodes.filter(n => n > 1 && [2,3,5,7,11,13].includes(n));\n'
        '}',
  );

  bool _isRunning = false;
  List<String> _consoleLogs = [
    '[SYSTEM] Terminal v4.0.4 online. Sandboxed execution environment ready.',
    '[SYSTEM] Target firewall: DEF-7 Sentinel. Requires prime port sequence filtering.',
  ];

  final List<Map<String, dynamic>> _testCases = [
    {
      'input': '[4, 7, 9, 11, 15]',
      'expected': '[7, 11]',
      'passed': null,
    },
    {
      'input': '[2, 3, 8, 10, 13]',
      'expected': '[2, 3, 13]',
      'passed': null,
    },
    {
      'input': '[1, 6, 12, 14, 17]',
      'expected': '[17]',
      'passed': null,
    },
  ];

  void _runCode() async {
    if (_isRunning || widget.isSolved) return;

    setState(() {
      _isRunning = true;
      _consoleLogs.add(
        '[EXEC] Injecting payload into DEF-7 Sentinel port 8080...',
      );
    });

    await Future.delayed(const Duration(milliseconds: 600));

    setState(() {
      _testCases[0]['passed'] = true;
      _consoleLogs.add(
        '[TEST 1/3] PASS - Input: [4, 7, 9, 11, 15] -> Output: [7, 11]',
      );
    });

    await Future.delayed(const Duration(milliseconds: 500));

    setState(() {
      _testCases[1]['passed'] = true;
      _consoleLogs.add(
        '[TEST 2/3] PASS - Input: [2, 3, 8, 10, 13] -> Output: [2, 3, 13]',
      );
    });

    await Future.delayed(const Duration(milliseconds: 500));

    setState(() {
      _testCases[2]['passed'] = true;
      _consoleLogs.add(
        '[TEST 3/3] PASS - Input: [1, 6, 12, 14, 17] -> All nodes verified.',
      );
      _consoleLogs.add(
        '[SUCCESS] FIREWALL DEFEATED! Key Clue revealed: 0x7F_KAPPA',
      );
      _isRunning = false;
    });

    widget.onSolved();
  }

  void _reset() {
    setState(() {
      _testCases[0]['passed'] = null;
      _testCases[1]['passed'] = null;
      _testCases[2]['passed'] = null;
      _consoleLogs = [
        '[SYSTEM] Terminal reset. Awaiting code injection...',
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    const role = OperativeRole.hacker;

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
                Row(
                  children: [
                    Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: VaultColors.alarmRed,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: VaultColors.engineerAmber,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: VaultColors.hackerGreen,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 16),
                Icon(role.icon, color: role.color, size: 18),
                const SizedBox(width: 8),
                Text(
                  'TERMINAL // ${role.codeName}',
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
                          'SECURITY DEFEATED',
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

          // Code Editor & Instructions
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'OBJECTIVE: INJECT PRIME FILTER SUBROUTINE',
                            style: GoogleFonts.orbitron(
                              color: role.color,
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Filter the rogue token cluster to isolate prime authentication nodes and bypass Sentinel firewall.',
                            style: TextStyle(
                              color: VaultColors.textSecondary,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Editor Box
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF05080E),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: VaultColors.border),
                  ),
                  child: TextField(
                    controller: _codeController,
                    maxLines: 4,
                    style: GoogleFonts.jetBrainsMono(
                      color: VaultColors.hackerGreen,
                      fontSize: 13,
                      height: 1.4,
                    ),
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.all(12),
                      border: InputBorder.none,
                    ),
                  ),
                ),

                const SizedBox(height: 14),

                // Test Cases HUD
                Row(
                  children: _testCases.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final tc = entry.value;
                    final passed = tc['passed'];

                    Color badgeColor = VaultColors.textMuted;
                    String statusText = 'WAITING';
                    IconData icon = Icons.hourglass_empty_rounded;

                    if (passed == true) {
                      badgeColor = VaultColors.hackerGreen;
                      statusText = 'PASSED';
                      icon = Icons.check_circle_outline;
                    }

                    return Expanded(
                      child: Container(
                        margin: EdgeInsets.only(right: idx < 2 ? 8 : 0),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: badgeColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: badgeColor.withValues(alpha: 0.4),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(icon, color: badgeColor, size: 14),
                            const SizedBox(width: 6),
                            Text(
                              'CASE ${idx + 1}: $statusText',
                              style: GoogleFonts.jetBrainsMono(
                                color: badgeColor,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 14),

                // Action Bar
                Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: (_isRunning || widget.isSolved)
                          ? null
                          : _runCode,
                      icon: _isRunning
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.black,
                              ),
                            )
                          : const Icon(Icons.play_arrow_rounded, size: 18),
                      label: Text(
                        _isRunning ? 'EXECUTING...' : 'EXECUTE SUBROUTINE',
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: role.color,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 18,
                          vertical: 12,
                        ),
                        textStyle: GoogleFonts.jetBrainsMono(
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    OutlinedButton.icon(
                      onPressed: _reset,
                      icon: const Icon(Icons.refresh_rounded, size: 16),
                      label: const Text('RESET'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: VaultColors.textSecondary,
                        side: BorderSide(color: VaultColors.border),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 12,
                        ),
                        textStyle: GoogleFonts.jetBrainsMono(fontSize: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Terminal Output Console
                Container(
                  height: 110,
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF030508),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: VaultColors.border),
                  ),
                  child: ListView.builder(
                    reverse: true,
                    itemCount: _consoleLogs.length,
                    itemBuilder: (context, i) {
                      final log = _consoleLogs[_consoleLogs.length - 1 - i];
                      final isSuccess =
                          log.contains('SUCCESS') || log.contains('PASS');
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Text(
                          log,
                          style: GoogleFonts.jetBrainsMono(
                            color: isSuccess
                                ? VaultColors.hackerGreen
                                : VaultColors.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                      );
                    },
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
