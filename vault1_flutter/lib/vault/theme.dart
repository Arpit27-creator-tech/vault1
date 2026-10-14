import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class VaultColors {
  // Canopy & Forest Cyber Palette
  static const Color background = Color(0xFF051811);
  static const Color forestDeep = Color(0xFF020C07);
  static const Color forestCard = Color(0xFF051A12);
  static const Color forestGradientStart = Color(0xFF062417);
  static const Color forestGradientMid = Color(0xFF0A3824);
  static const Color forestGradientEnd = Color(0xFF041A11);

  // Neobrutalist Line & Shadow
  static const Color brutalBorder = Color(0xFF03140C);
  static const Color brutalShadow = Color(0xFF020C07);

  // Signature Vault Role Colors (Bright Vibrant Palette)
  static const Color emerald = Color(0xFF10B981);
  static const Color amber = Color(0xFFF59E0B);
  static const Color cyan = Color(0xFF0EA5E9);
  static const Color purple = Color(0xFFA855F7);
  static const Color blue = Color(0xFF3B82F6);

  // Status & Utility Colors
  static const Color alarmRed = Color(0xFFEF4444);
  static const Color textLight = Color(0xFFFFFFFF);
  static const Color textMuted = Color(0xFF6EE7B7);
  static const Color textSlate = Color(0xFF94A3B8);
  static const Color warningOrange = Color(0xFFF59E0B);
  static const Color serverpodBlue = Color(0xFF3B82F6);

  // Aliases for puzzle components
  static const Color panel = Color(0xFF072418);
  static const Color panelElevated = Color(0xFF0C3826);
  static const Color border = Color(0xFF0E4A32);
  static const Color borderGlow = Color(0xFF10B981);
  static const Color hackerGreen = emerald;
  static const Color engineerAmber = amber;
  static const Color scientistCyan = cyan;
  static const Color cryptoPurple = purple;
  static const Color textPrimary = textLight;
  static const Color textSecondary = textMuted;
}

class VaultStyles {
  // Claymorphic Box Decoration with tactile 3D volume, rounded corners, and soft depth
  static BoxDecoration clayBox({
    Color backgroundColor = VaultColors.forestCard,
    Color borderColor = const Color(0x1FFFFFFF),
    double borderWidth = 1.0,
    double borderRadius = 22.0,
  }) {
    return BoxDecoration(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(borderRadius),
      border: Border.all(color: borderColor, width: borderWidth),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.45),
          offset: const Offset(8, 14),
          blurRadius: 28,
          spreadRadius: 0,
        ),
        BoxShadow(
          color: Colors.white.withValues(alpha: 0.08),
          offset: const Offset(-2, -2),
          blurRadius: 6,
          spreadRadius: 0,
        ),
      ],
    );
  }

  // Claymorphic Button Style
  static ButtonStyle clayButton({
    required Color backgroundColor,
    required Color foregroundColor,
    double borderRadius = 16.0,
  }) {
    return ElevatedButton.styleFrom(
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
      elevation: 6,
      shadowColor: Colors.black.withValues(alpha: 0.4),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      shape: RoundedRectangleBorder(
        side: const BorderSide(color: Color(0x2EFFFFFF), width: 1.0),
        borderRadius: BorderRadius.circular(borderRadius),
      ),
    );
  }

  // Backwards-compatible Box Decoration with claymorphic tactile depth
  static BoxDecoration brutalBox({
    Color backgroundColor = VaultColors.forestCard,
    Color borderColor = const Color(0x1FFFFFFF),
    Color shadowColor = const Color(0x66000000),
    double borderWidth = 1.0,
    double shadowOffset = 6.0,
    double borderRadius = 18.0,
  }) {
    return BoxDecoration(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(borderRadius),
      border: Border.all(color: borderColor, width: borderWidth),
      boxShadow: [
        BoxShadow(
          color: shadowColor,
          offset: Offset(shadowOffset, shadowOffset * 1.5),
          blurRadius: 20,
        ),
        BoxShadow(
          color: Colors.white.withValues(alpha: 0.06),
          offset: const Offset(-2, -2),
          blurRadius: 5,
        ),
      ],
    );
  }

  // Backwards-compatible Button Style
  static ButtonStyle brutalButton({
    required Color backgroundColor,
    required Color foregroundColor,
    double shadowOffset = 5.0,
  }) {
    return clayButton(
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
    );
  }

  // Typography
  static TextStyle chakra({
    Color color = VaultColors.textLight,
    double fontSize = 16,
    FontWeight fontWeight = FontWeight.bold,
    double letterSpacing = 1.0,
  }) {
    return GoogleFonts.chakraPetch(
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
      letterSpacing: letterSpacing,
    );
  }

  static TextStyle rajdhani({
    Color color = VaultColors.textLight,
    double fontSize = 15,
    FontWeight fontWeight = FontWeight.w600,
  }) {
    return GoogleFonts.rajdhani(
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
    );
  }

  static TextStyle mono({
    Color color = VaultColors.textLight,
    double fontSize = 12,
    FontWeight fontWeight = FontWeight.w600,
  }) {
    return GoogleFonts.jetBrainsMono(
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
    );
  }
}

class VaultTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: VaultColors.background,
      colorScheme: const ColorScheme.dark(
        surface: VaultColors.forestCard,
        primary: VaultColors.emerald,
        secondary: VaultColors.amber,
        error: VaultColors.alarmRed,
      ),
      textTheme: GoogleFonts.chakraPetchTextTheme(ThemeData.dark().textTheme),
    );
  }
}
