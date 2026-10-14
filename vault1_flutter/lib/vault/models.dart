import 'package:flutter/material.dart';
import 'theme.dart';

enum OperativeRole {
  hacker(
    name: 'Canopy Hacker',
    discipline: 'Computer Science & Logic',
    color: VaultColors.emerald,
    icon: Icons.terminal_rounded,
    codeName: 'CIPHER-01',
    description: 'Bypass security subroutines & execute algorithmic decoders.',
    cardTitle: 'Canopy Infiltrator',
  ),
  engineer(
    name: 'Woodland Engineer',
    discipline: 'Physics & Optics',
    color: VaultColors.amber,
    icon: Icons.bolt_rounded,
    codeName: 'PHOTON-02',
    description:
        'Calibrate optical mirrors to refract high-flux laser beam into receptor.',
    cardTitle: 'Laser Specialist',
  ),
  scientist(
    name: 'Flora Scientist',
    discipline: 'Chemistry & Biology',
    color: VaultColors.cyan,
    icon: Icons.biotech_rounded,
    codeName: 'SYNTH-03',
    description:
        'Balance reaction stoichiometry and neutralize acidic security vault lock.',
    cardTitle: 'Botanical Chemist',
  ),
  cryptographer(
    name: 'Mist Cryptographer',
    discipline: 'Math & Ciphers',
    color: VaultColors.purple,
    icon: Icons.vpn_key_rounded,
    codeName: 'ENIGMA-04',
    description:
        'Tune into carrier broadcast and crack encrypted military cipher.',
    cardTitle: 'Cipher Specialist',
  );

  final String name;
  final String discipline;
  final Color color;
  final IconData icon;
  final String codeName;
  final String description;
  final String cardTitle;

  const OperativeRole({
    required this.name,
    required this.discipline,
    required this.color,
    required this.icon,
    required this.codeName,
    required this.description,
    required this.cardTitle,
  });
}
