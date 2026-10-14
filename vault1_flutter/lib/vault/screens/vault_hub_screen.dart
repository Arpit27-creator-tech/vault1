import 'dart:async';
import 'package:flutter/material.dart';

import '../../client.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets/crypto_deck.dart';
import '../widgets/engineer_laser.dart';
import '../widgets/extraction_dialog.dart';
import '../widgets/hacker_terminal.dart';
import '../widgets/scientist_lab.dart';
import '../widgets/vault_video_background.dart';
import 'vault_hero_page.dart';

class VaultHubScreen extends StatefulWidget {
  const VaultHubScreen({super.key});

  @override
  State<VaultHubScreen> createState() => _VaultHubScreenState();
}

class _VaultHubScreenState extends State<VaultHubScreen> {
  // Current View: 'hero' (Default Home) or 'cockpit' (Active Mission)
  bool _isInHeistCockpit = false;

  OperativeRole _selectedRole = OperativeRole.hacker;

  final Map<OperativeRole, bool> _solvedMap = {
    OperativeRole.hacker: false,
    OperativeRole.engineer: false,
    OperativeRole.scientist: false,
    OperativeRole.cryptographer: false,
  };

  int _secondsRemaining = 900;
  Timer? _countdownTimer;

  String _serverpodStatus = 'SERVERPOD: ONLINE';

  @override
  void initState() {
    super.initState();
    _startTimer();
    _testServerpodConnection();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        if (mounted) {
          setState(() {
            _secondsRemaining--;
          });
        }
      } else {
        timer.cancel();
      }
    });
  }

  void _testServerpodConnection() async {
    try {
      final response = await client.greeting.hello('Agent');
      if (mounted) {
        setState(() {
          _serverpodStatus = 'SERVERPOD: ${response.message}';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _serverpodStatus = 'SERVERPOD ACTIVE';
        });
      }
    }
  }

  String _formatTimer(int totalSeconds) {
    final mins = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final secs = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$mins:$secs';
  }

  bool get _allSolved => _solvedMap.values.every((solved) => solved);

  void _markRoleSolved(OperativeRole role) {
    setState(() {
      _solvedMap[role] = true;
    });

    if (_allSolved) {
      _triggerExtraction();
    }
  }

  void _triggerExtraction() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => ExtractionDialog(
        solvedMap: _solvedMap,
        onResetMission: _resetMission,
      ),
    );
  }

  void _resetMission() {
    setState(() {
      _solvedMap.updateAll((key, value) => false);
      _secondsRemaining = 900;
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget content;

    if (!_isInHeistCockpit) {
      content = VaultHeroPage(
        onLaunchHeist: () {
          setState(() {
            _isInHeistCockpit = true;
          });
        },
        onSelectRole: (role) {
          setState(() {
            _selectedRole = role;
            _isInHeistCockpit = true;
          });
        },
      );
    } else {
      content = Scaffold(
        backgroundColor: Colors.transparent,
        body: SafeArea(
          child: Column(
            children: [
              // Top HUD Bar with Return Button
              _buildCockpitHeader(),

              // Operative Role Tabs with Canopy Brutal Styling
              _buildRoleTabs(),

              // Main Workspace View
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  child: Column(
                    children: [
                      _buildActivePuzzle(),
                      const SizedBox(height: 16),
                      _buildInterdependenceLedger(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return VaultVideoBackground(child: content);
  }

  Widget _buildCockpitHeader() {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 10 : 16,
        vertical: isMobile ? 8 : 12,
      ),
      decoration: const BoxDecoration(
        color: Color(0xFF020C07),
        border: Border(
          bottom: BorderSide(color: VaultColors.brutalBorder, width: 2.5),
        ),
      ),
      child: Row(
        children: [
          // Return to Hero HQ Button
          InkWell(
            onTap: () => setState(() => _isInHeistCockpit = false),
            child: Container(
              padding: EdgeInsets.symmetric(
                horizontal: isMobile ? 8 : 10,
                vertical: isMobile ? 5 : 6,
              ),
              decoration: VaultStyles.brutalBox(
                backgroundColor: const Color(0xFF072618),
                shadowOffset: 2,
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.arrow_back_rounded,
                    color: VaultColors.emerald,
                    size: 16,
                  ),
                  if (!isMobile) ...[
                    const SizedBox(width: 6),
                    Text(
                      'HQ',
                      style: VaultStyles.chakra(
                        color: VaultColors.emerald,
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          SizedBox(width: isMobile ? 8 : 12),

          // Vault Logo
          Row(
            children: [
              Text(
                'V.A.U.L.T',
                style: VaultStyles.chakra(
                  color: VaultColors.textLight,
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: isMobile ? 1 : 2,
                ),
              ),
              if (!isMobile) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: VaultColors.alarmRed,
                    border: Border.all(color: VaultColors.brutalBorder),
                  ),
                  child: Text(
                    'LIVE HEIST',
                    style: VaultStyles.mono(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ],
          ),

          const Spacer(),

          // Serverpod Connection Pill
          if (!isMobile)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: VaultStyles.brutalBox(
                backgroundColor: const Color(0xFF061F14),
                borderColor: VaultColors.emerald,
                borderWidth: 1.5,
                shadowOffset: 2.0,
              ),
              child: Text(
                _serverpodStatus,
                style: VaultStyles.mono(
                  color: VaultColors.emerald,
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                ),
              ),
            )
          else
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF061F14),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: VaultColors.emerald, width: 1),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: VaultColors.emerald,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'SYNC',
                    style: VaultStyles.mono(
                      color: VaultColors.emerald,
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),

          SizedBox(width: isMobile ? 6 : 10),

          // Countdown Timer
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 7 : 10,
              vertical: 4,
            ),
            decoration: VaultStyles.brutalBox(
              backgroundColor: const Color(0xFF03060C),
              borderColor: VaultColors.alarmRed,
              borderWidth: 1.5,
              shadowOffset: 2.0,
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.timer_outlined,
                  color: VaultColors.alarmRed,
                  size: 13,
                ),
                const SizedBox(width: 3),
                Text(
                  _formatTimer(_secondsRemaining),
                  style: VaultStyles.chakra(
                    color: VaultColors.alarmRed,
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoleTabs() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: const BoxDecoration(
        color: Color(0xFF041910),
        border: Border(
          bottom: BorderSide(color: VaultColors.brutalBorder, width: 2.0),
        ),
      ),
      child: Row(
        children: OperativeRole.values.map((role) {
          final isSelected = _selectedRole == role;
          final isSolved = _solvedMap[role] == true;

          return Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: InkWell(
                onTap: () => setState(() => _selectedRole = role),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 8,
                    horizontal: 6,
                  ),
                  decoration: VaultStyles.brutalBox(
                    backgroundColor: isSelected
                        ? role.color
                        : const Color(0xFF020C07),
                    borderColor: isSelected
                        ? VaultColors.brutalBorder
                        : const Color(0xFF0A3320),
                    borderWidth: 2.0,
                    shadowOffset: isSelected ? 3.0 : 1.5,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        isSolved ? Icons.check_circle_rounded : role.icon,
                        color: isSelected
                            ? VaultColors.forestDeep
                            : (isSolved ? VaultColors.emerald : Colors.grey),
                        size: 15,
                      ),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          role.name.toUpperCase(),
                          overflow: TextOverflow.ellipsis,
                          style: VaultStyles.chakra(
                            color: isSelected
                                ? VaultColors.forestDeep
                                : Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildActivePuzzle() {
    switch (_selectedRole) {
      case OperativeRole.hacker:
        return HackerTerminalWidget(
          isSolved: _solvedMap[OperativeRole.hacker] == true,
          onSolved: () => _markRoleSolved(OperativeRole.hacker),
        );
      case OperativeRole.engineer:
        return EngineerLaserGridWidget(
          isSolved: _solvedMap[OperativeRole.engineer] == true,
          onSolved: () => _markRoleSolved(OperativeRole.engineer),
        );
      case OperativeRole.scientist:
        return ScientistLabWidget(
          isSolved: _solvedMap[OperativeRole.scientist] == true,
          onSolved: () => _markRoleSolved(OperativeRole.scientist),
        );
      case OperativeRole.cryptographer:
        return CryptographerDeckWidget(
          isSolved: _solvedMap[OperativeRole.cryptographer] == true,
          onSolved: () => _markRoleSolved(OperativeRole.cryptographer),
        );
    }
  }

  Widget _buildInterdependenceLedger() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: VaultStyles.brutalBox(
        backgroundColor: const Color(0xFF03140C),
        borderWidth: 3.0,
        shadowOffset: 5.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.hub_rounded,
                color: VaultColors.emerald,
                size: 18,
              ),
              const SizedBox(width: 8),
              Text(
                'SQUAD INTERDEPENDENCE LEDGER',
                style: VaultStyles.chakra(
                  color: VaultColors.textLight,
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const Spacer(),
              Text(
                '${_solvedMap.values.where((v) => v).length} / 4 CLUES ASSEMBLED',
                style: VaultStyles.mono(
                  color: _allSolved ? VaultColors.emerald : VaultColors.amber,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Interlocked Clues Row
          Row(
            children: OperativeRole.values.map((role) {
              final isSolved = _solvedMap[role] == true;
              String clueText = 'LOCKED';
              if (isSolved) {
                switch (role) {
                  case OperativeRole.hacker:
                    clueText = '0x7F_KAPPA';
                    break;
                  case OperativeRole.engineer:
                    clueText = '142.5 MHz';
                    break;
                  case OperativeRole.scientist:
                    clueText = 'pH 7.2';
                    break;
                  case OperativeRole.cryptographer:
                    clueText = 'PROMETHEUS';
                    break;
                }
              }

              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isSolved
                        ? role.color.withValues(alpha: 0.15)
                        : const Color(0xFF020905),
                    border: Border.all(
                      color: isSolved ? role.color : const Color(0xFF0E3823),
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(role.icon, color: role.color, size: 11),
                          const SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              role.cardTitle.toUpperCase(),
                              overflow: TextOverflow.ellipsis,
                              style: VaultStyles.chakra(
                                color: role.color,
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        clueText,
                        style: VaultStyles.mono(
                          color: isSolved ? Colors.white : Colors.grey,
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

          const SizedBox(height: 16),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _allSolved ? _triggerExtraction : null,
                  icon: const Icon(Icons.lock_open_rounded, size: 18),
                  label: Text(
                    _allSolved
                        ? 'EXECUTE MASTER EXTRACTION'
                        : 'EXTRACTION LOCKED (4/4 REQUIRED)',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: VaultColors.emerald,
                    foregroundColor: VaultColors.forestDeep,
                    disabledBackgroundColor: const Color(0xFF072115),
                    disabledForegroundColor: Colors.grey,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    textStyle: VaultStyles.chakra(
                      fontWeight: FontWeight.w900,
                      fontSize: 12,
                      letterSpacing: 1,
                    ),
                    shape: RoundedRectangleBorder(
                      side: const BorderSide(
                        color: VaultColors.brutalBorder,
                        width: 2,
                      ),
                      borderRadius: BorderRadius.zero,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              OutlinedButton(
                onPressed: _resetMission,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.grey,
                  side: const BorderSide(color: Color(0xFF0D3B25)),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                ),
                child: Text(
                  'RESET',
                  style: VaultStyles.mono(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
