import 'dart:async';
import 'package:flutter/material.dart';

import '../../client.dart';
import '../models.dart';
import '../theme.dart';

class VaultHeroPage extends StatefulWidget {
  final VoidCallback onLaunchHeist;
  final Function(OperativeRole) onSelectRole;

  const VaultHeroPage({
    super.key,
    required this.onLaunchHeist,
    required this.onSelectRole,
  });

  @override
  State<VaultHeroPage> createState() => _VaultHeroPageState();
}

class _VaultHeroPageState extends State<VaultHeroPage> {
  int _liveRelayStep = 0;
  bool _isSimulatingRelay = false;
  String _serverpodStatus = 'LIVE SERVERPOD 4.0';

  final List<Map<String, dynamic>> _transmissions = [
    {
      'sender': 'Canopy Hacker',
      'color': VaultColors.emerald,
      'text':
          'Array pointer unlocked at 0x7FF. Sending refractive index n=1.52 to Engineer!',
    },
    {
      'sender': 'Woodland Engineer',
      'color': VaultColors.amber,
      'text':
          'Snell angle calibrated at 45.0°. Deflecting green laser to Bio-Chamber!',
    },
    {
      'sender': 'Flora Scientist',
      'color': VaultColors.cyan,
      'text':
          'Stoichiometry balanced 2H₂ + O₂ -> 2H₂O. Neutralizer pH stabilized at 7.4!',
    },
    {
      'sender': 'Mist Cryptographer',
      'color': VaultColors.purple,
      'text':
          'Cipher shift key +7 decoded! Final master override verified. Vault unlocked!',
    },
  ];

  @override
  void initState() {
    super.initState();
    _checkServerpod();
  }

  void _checkServerpod() async {
    try {
      final res = await client.greeting.hello('Agent');
      if (mounted) {
        setState(() {
          _serverpodStatus = 'SERVERPOD: ${res.message}';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _serverpodStatus = 'SERVERPOD READY';
        });
      }
    }
  }

  void _runRelaySimulation() async {
    if (_isSimulatingRelay) return;

    setState(() {
      _isSimulatingRelay = true;
      _liveRelayStep = 1;
    });

    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _liveRelayStep = 2);

    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _liveRelayStep = 3);

    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _liveRelayStep = 4);

    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: VaultColors.emerald,
        content: Text(
          '🔓 MASTER VAULT OVERRIDE CONFIRMED! 4 ROLES INTERLOCKED!',
          style: VaultStyles.chakra(
            color: VaultColors.forestDeep,
            fontSize: 13,
          ),
        ),
        duration: const Duration(milliseconds: 500),
      ),
    );

    setState(() {
      _isSimulatingRelay = false;
      _liveRelayStep = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // ── 1. Top Canopy Navigation Bar ──────────────────────────────
              _buildNavbar(),

              // ── 2. Hero Section ──────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
                child: _buildHeroBanner(),
              ),

              // ── 3. High-Impact Stats Bar ─────────────────────────────────
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: _buildStatsBar(),
              ),

              // ── 4. Operative Specialist Classes ──────────────────────────
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
                child: _buildOperativesShowcase(),
              ),

              // ── 5. Global Syndicate Leaderboard Preview ──────────────────
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                child: _buildLeaderboardSection(),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavbar() {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 600;

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 20,
        vertical: isMobile ? 10 : 14,
      ),
      decoration: const BoxDecoration(
        color: Color(0xCC020C07),
        border: Border(
          bottom: BorderSide(color: Color(0x3310B981), width: 1.5),
        ),
      ),
      child: Row(
        children: [
          // Logo & Title
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(isMobile ? 5 : 7),
                decoration: VaultStyles.brutalBox(
                  backgroundColor: VaultColors.emerald,
                  shadowOffset: 2.0,
                ),
                child: Text(
                  '🌲',
                  style: TextStyle(fontSize: isMobile ? 13 : 16),
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'V.A.U.L.T',
                    style: VaultStyles.chakra(
                      color: VaultColors.textLight,
                      fontSize: isMobile ? 15 : 18,
                      fontWeight: FontWeight.w900,
                      letterSpacing: isMobile ? 1.5 : 2.0,
                    ),
                  ),
                  if (!isMobile)
                    Text(
                      'CANOPY HEIST SYNDICATE',
                      style: VaultStyles.mono(
                        color: VaultColors.emerald,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                ],
              ),
            ],
          ),

          const Spacer(),

          // Serverpod Connection Badge
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 7 : 10,
              vertical: isMobile ? 3 : 5,
            ),
            decoration: VaultStyles.brutalBox(
              backgroundColor: const Color(0xFF072618),
              borderColor: VaultColors.emerald,
              borderWidth: 1.5,
              shadowOffset: 2.0,
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
                const SizedBox(width: 5),
                Text(
                  isMobile ? 'SYNC' : _serverpodStatus,
                  style: VaultStyles.mono(
                    color: VaultColors.emerald,
                    fontSize: isMobile ? 9 : 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          SizedBox(width: isMobile ? 6 : 10),

          // Operative Profile Chip
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 7 : 10,
              vertical: isMobile ? 3 : 5,
            ),
            decoration: VaultStyles.brutalBox(
              backgroundColor: VaultColors.amber,
              shadowOffset: 2.0,
            ),
            child: Text(
              isMobile ? 'AP-7' : 'OPERATIVE // AP-7',
              style: VaultStyles.chakra(
                color: VaultColors.forestDeep,
                fontSize: isMobile ? 10 : 11,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroBanner() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(
          0xB2051A12,
        ), // Semi-transparent cyber card so video shines through
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0x3310B981), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.45),
            offset: const Offset(4, 8),
            blurRadius: 16,
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isNarrow = constraints.maxWidth < 800;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isNarrow) ...[
                _buildHeroLeftContent(),
                const SizedBox(height: 24),
                _buildLiveRelayCard(),
              ] else
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(flex: 7, child: _buildHeroLeftContent()),
                    const SizedBox(width: 28),
                    Expanded(flex: 5, child: _buildLiveRelayCard()),
                  ],
                ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeroLeftContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Rotated Yellow Tag
        Transform.rotate(
          angle: -0.026,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: VaultStyles.brutalBox(
              backgroundColor: VaultColors.amber,
              borderWidth: 2.5,
              shadowOffset: 3.0,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🌲', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 6),
                Text(
                  'REAL–TIME MULTIPLAYER LEARNING HEIST',
                  style: VaultStyles.chakra(
                    color: VaultColors.forestDeep,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 18),

        // Giant Headline: EDUCATION IS A [TEAM] SPORT!
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: 10,
          runSpacing: 10,
          children: [
            Text(
              'EDUCATION IS A',
              style: VaultStyles.chakra(
                color: VaultColors.textLight,
                fontSize: 34,
                fontWeight: FontWeight.w900,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              decoration: VaultStyles.brutalBox(
                backgroundColor: VaultColors.emerald,
                borderWidth: 3.5,
                shadowOffset: 5.0,
              ),
              child: Text(
                'TEAM',
                style: VaultStyles.chakra(
                  color: VaultColors.forestDeep,
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
              decoration: VaultStyles.brutalBox(
                backgroundColor: VaultColors.emerald,
                borderWidth: 3.5,
                shadowOffset: 5.0,
              ),
              child: Text(
                'SPORT!',
                style: VaultStyles.chakra(
                  color: VaultColors.forestDeep,
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        Text(
          'Assemble a 4-specialist crew to crack interconnected academic vaults across Computer Science, Physics, Chemistry, and Discrete Mathematics. Real-time puzzle interdependence means no single player can win alone.',
          style: VaultStyles.rajdhani(
            color: const Color(0xFFD1FAE5),
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
        ),

        const SizedBox(height: 22),

        // 4 Action Buttons
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            // LAUNCH CO-OP HEIST
            _buildBrutalActionButton(
              label: 'LAUNCH CO-OP HEIST',
              icon: Icons.play_arrow_rounded,
              bgColor: VaultColors.emerald,
              textColor: VaultColors.forestDeep,
              onTap: widget.onLaunchHeist,
            ),
            // SQUAD LOBBY
            _buildBrutalActionButton(
              label: 'SQUAD LOBBY',
              icon: Icons.people_rounded,
              bgColor: const Color(0xFF0A261B),
              textColor: VaultColors.textLight,
              onTap: widget.onLaunchHeist,
            ),
            // SOLO TRAINING
            _buildBrutalActionButton(
              label: 'SOLO TRAINING',
              icon: Icons.menu_book_rounded,
              bgColor: VaultColors.cyan,
              textColor: VaultColors.forestDeep,
              badgeText: 'NEW',
              onTap: () => widget.onSelectRole(OperativeRole.hacker),
            ),
            // CANOPY MAP
            _buildBrutalActionButton(
              label: 'CANOPY MAP',
              icon: Icons.map_rounded,
              bgColor: VaultColors.amber,
              textColor: VaultColors.forestDeep,
              onTap: widget.onLaunchHeist,
            ),
          ],
        ),

        const SizedBox(height: 18),

        // Value props
        Wrap(
          spacing: 16,
          runSpacing: 8,
          children: [
            _buildCheckmarkProp('Zero Solo Rote Learning'),
            _buildCheckmarkProp('Real-Time Interlock Relay'),
            _buildCheckmarkProp('Post-Heist Skill Analytics'),
          ],
        ),
      ],
    );
  }

  Widget _buildCheckmarkProp(String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.check_circle_rounded,
          color: VaultColors.emerald,
          size: 16,
        ),
        const SizedBox(width: 6),
        Text(
          text,
          style: VaultStyles.mono(color: const Color(0xFFA7F3D0), fontSize: 11),
        ),
      ],
    );
  }

  Widget _buildBrutalActionButton({
    required String label,
    required IconData icon,
    required Color bgColor,
    required Color textColor,
    required VoidCallback onTap,
    String? badgeText,
  }) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            decoration: VaultStyles.brutalBox(
              backgroundColor: bgColor,
              borderWidth: 3.0,
              shadowOffset: 4.0,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, color: textColor, size: 18),
                const SizedBox(width: 8),
                Text(
                  label,
                  style: VaultStyles.chakra(
                    color: textColor,
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
        ),
        if (badgeText != null)
          Positioned(
            top: -8,
            right: -6,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: VaultStyles.brutalBox(
                backgroundColor: VaultColors.amber,
                borderWidth: 1.5,
                shadowOffset: 1.5,
              ),
              child: Text(
                badgeText,
                style: VaultStyles.mono(
                  color: VaultColors.forestDeep,
                  fontSize: 8,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildLiveRelayCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: VaultStyles.brutalBox(
        backgroundColor: const Color(0xFF03140C),
        borderWidth: 3.5,
        shadowOffset: 6.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: VaultColors.alarmRed,
                  border: Border.all(color: VaultColors.brutalBorder),
                ),
                child: const Icon(
                  Icons.radio_rounded,
                  color: Colors.white,
                  size: 16,
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'LIVE SQUAD INTERDEPENDENCE HUD',
                    style: VaultStyles.chakra(
                      color: VaultColors.textLight,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.0,
                    ),
                  ),
                  Text(
                    'SYNCHRONOUS PUZZLE RELAY',
                    style: VaultStyles.mono(
                      color: VaultColors.emerald,
                      fontSize: 9,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: VaultColors.emerald,
                  border: Border.all(color: VaultColors.brutalBorder),
                ),
                child: Text(
                  'ONLINE',
                  style: VaultStyles.mono(
                    color: VaultColors.forestDeep,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // 4-step Relay Grid
          Row(
            children: [
              _buildRelayStep(
                1,
                '1. HACK',
                Icons.terminal,
                _liveRelayStep >= 1,
              ),
              const SizedBox(width: 6),
              _buildRelayStep(
                2,
                '2. LASER',
                Icons.flash_on,
                _liveRelayStep >= 2,
              ),
              const SizedBox(width: 6),
              _buildRelayStep(3, '3. CHEM', Icons.science, _liveRelayStep >= 3),
              const SizedBox(width: 6),
              _buildRelayStep(
                4,
                '4. CRYPT',
                Icons.vpn_key,
                _liveRelayStep >= 4,
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Live Feeds
          Container(
            height: 160,
            padding: const EdgeInsets.all(6),
            child: ListView.builder(
              itemCount: _transmissions.length,
              itemBuilder: (context, idx) {
                final t = _transmissions[idx];
                return Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF020905),
                    border: Border.all(color: const Color(0xFF0B2B1B)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '[${t['sender']}]',
                            style: VaultStyles.mono(
                              color: t['color'],
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          Text(
                            'LIVE FEED',
                            style: VaultStyles.mono(
                              color: Colors.grey,
                              fontSize: 8,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        t['text'],
                        style: VaultStyles.mono(
                          color: const Color(0xFFE2FBEA),
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 10),

          // Bottom Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _isSimulatingRelay ? null : _runRelaySimulation,
                  icon: const Icon(Icons.sync_rounded, size: 16),
                  label: Text(
                    _isSimulatingRelay
                        ? 'RELAYING DATA...'
                        : 'TEST SQUAD INTERLOCK',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: VaultColors.amber,
                    foregroundColor: VaultColors.forestDeep,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    textStyle: VaultStyles.chakra(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
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
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: widget.onLaunchHeist,
                icon: const Icon(Icons.arrow_forward_rounded, size: 16),
                label: const Text('LIVE COCKPIT'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: VaultColors.emerald,
                  foregroundColor: VaultColors.forestDeep,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 12,
                  ),
                  textStyle: VaultStyles.chakra(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
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
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRelayStep(
    int stepNum,
    String label,
    IconData icon,
    bool active,
  ) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: active ? VaultColors.emerald : const Color(0xFF020C07),
          border: Border.all(
            color: active ? VaultColors.amber : VaultColors.brutalBorder,
            width: 2,
          ),
          boxShadow: active
              ? const [
                  BoxShadow(
                    color: VaultColors.amber,
                    offset: Offset(2, 2),
                    blurRadius: 0,
                  ),
                ]
              : null,
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 14,
              color: active ? VaultColors.forestDeep : Colors.grey,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: VaultStyles.chakra(
                color: active ? VaultColors.forestDeep : Colors.grey,
                fontSize: 9,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsBar() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 600;

        final stats = [
          {
            'label': 'Active Operatives',
            'val': '4,820+',
            'icon': Icons.people,
            'color': VaultColors.emerald,
          },
          {
            'label': 'STEM Vaults Solved',
            'val': '18,500+',
            'icon': Icons.shield,
            'color': VaultColors.amber,
          },
          {
            'label': 'Co-Op Success Rate',
            'val': '98.4%',
            'icon': Icons.check_circle,
            'color': VaultColors.blue,
          },
          {
            'label': 'Specialist Roles',
            'val': '4 Classes',
            'icon': Icons.auto_awesome,
            'color': VaultColors.purple,
          },
        ];

        return GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: stats.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: isMobile ? 2 : 4,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: isMobile ? 2.2 : 2.6,
          ),
          itemBuilder: (context, i) {
            final item = stats[i];
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF051C12),
                border: Border.all(color: const Color(0xFF0F4A30)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        (item['label'] as String).toUpperCase(),
                        style: VaultStyles.mono(
                          color: Colors.grey,
                          fontSize: 9,
                        ),
                      ),
                      Icon(
                        item['icon'] as IconData,
                        size: 14,
                        color: item['color'] as Color,
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['val'] as String,
                    style: VaultStyles.chakra(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildOperativesShowcase() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: VaultStyles.brutalBox(
                backgroundColor: VaultColors.emerald,
                shadowOffset: 2,
              ),
              child: const Icon(
                Icons.military_tech_rounded,
                color: VaultColors.forestDeep,
                size: 16,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              'SQUAD SPECIALIST CLASSES',
              style: VaultStyles.chakra(
                color: VaultColors.textLight,
                fontSize: 16,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        LayoutBuilder(
          builder: (context, constraints) {
            final isMobile = constraints.maxWidth < 700;

            return GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: OperativeRole.values.length,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: isMobile ? 1 : 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: isMobile ? 2.4 : 2.5,
              ),
              itemBuilder: (context, i) {
                final role = OperativeRole.values[i];
                return InkWell(
                  onTap: () => widget.onSelectRole(role),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: VaultStyles.brutalBox(
                      backgroundColor: const Color(0xFF041910),
                      borderWidth: 2.5,
                      shadowOffset: 4.0,
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: role.color.withValues(alpha: 0.15),
                            border: Border.all(color: role.color, width: 2),
                          ),
                          child: Icon(role.icon, color: role.color, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    role.name.toUpperCase(),
                                    style: VaultStyles.chakra(
                                      color: role.color,
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    role.codeName,
                                    style: VaultStyles.mono(
                                      color: Colors.grey,
                                      fontSize: 10,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                role.discipline,
                                style: VaultStyles.rajdhani(
                                  color: VaultColors.textMuted,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                role.description,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: VaultStyles.mono(
                                  color: VaultColors.textSlate,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          },
        ),
      ],
    );
  }

  Widget _buildLeaderboardSection() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF03140C),
        border: Border.all(color: const Color(0xFF0D472B), width: 2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: VaultColors.amber,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.emoji_events_rounded,
                      color: VaultColors.forestDeep,
                      size: 14,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'WORLDWIDE RANKINGS',
                      style: VaultStyles.chakra(
                        color: VaultColors.forestDeep,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              Text(
                'SEASON 24',
                style: VaultStyles.mono(
                  color: VaultColors.emerald,
                  fontSize: 10,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Global Syndicate Leaderboard',
            style: VaultStyles.chakra(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),

          // Top 3 operatives list
          _buildLeaderboardRow(
            '1',
            'KAPPA_SENTINEL',
            'Canopy Hacker',
            '14,250 XP',
            VaultColors.emerald,
          ),
          const Divider(color: Color(0xFF0D3823), height: 12),
          _buildLeaderboardRow(
            '2',
            'PHOTON_BLAZE',
            'Woodland Engineer',
            '12,890 XP',
            VaultColors.amber,
          ),
          const Divider(color: Color(0xFF0D3823), height: 12),
          _buildLeaderboardRow(
            '3',
            'BIO_TITRATION',
            'Flora Scientist',
            '11,400 XP',
            VaultColors.cyan,
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardRow(
    String rank,
    String username,
    String role,
    String xp,
    Color roleColor,
  ) {
    return Row(
      children: [
        Container(
          width: 22,
          height: 22,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: rank == '1' ? VaultColors.amber : const Color(0xFF082B1B),
            shape: BoxShape.circle,
          ),
          child: Text(
            rank,
            style: VaultStyles.chakra(
              color: rank == '1' ? VaultColors.forestDeep : Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: 10),
        Text(
          username,
          style: VaultStyles.mono(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '($role)',
          style: VaultStyles.mono(color: roleColor, fontSize: 10),
        ),
        const Spacer(),
        Text(
          xp,
          style: VaultStyles.chakra(
            color: VaultColors.amber,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
