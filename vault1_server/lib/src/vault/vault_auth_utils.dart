import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';

/// Minimal HS256 JWT helper — enough for Vault's REST auth API.
/// Secret is read from environment or falls back to a dev default.
class VaultJwt {
  static final String _secret = const String.fromEnvironment(
    'VAULT_JWT_SECRET',
    defaultValue: 'vault-dev-secret-change-in-production',
  );

  static String _b64url(List<int> bytes) =>
      base64Url.encode(bytes).replaceAll('=', '');

  static String _sign(String data) {
    final hmac = Hmac(sha256, utf8.encode(_secret));
    return _b64url(hmac.convert(utf8.encode(data)).bytes);
  }

  /// Issue a JWT for the given [userId] valid for [expiresInDays] days.
  static String issue(int userId, {int expiresInDays = 30}) {
    final header = _b64url(
      utf8.encode(jsonEncode({'alg': 'HS256', 'typ': 'JWT'})),
    );
    final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    final payload = _b64url(
      utf8.encode(
        jsonEncode({
          'sub': userId,
          'iat': now,
          'exp': now + expiresInDays * 86400,
        }),
      ),
    );
    final sig = _sign('$header.$payload');
    return '$header.$payload.$sig';
  }

  /// Verify token and return the [userId], or null if invalid / expired.
  static int? verify(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return null;
      final expected = _sign('${parts[0]}.${parts[1]}');
      if (expected != parts[2]) return null;
      final payload = jsonDecode(
        utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
      );
      final exp = payload['exp'] as int;
      if (DateTime.now().millisecondsSinceEpoch ~/ 1000 > exp) return null;
      return payload['sub'] as int;
    } catch (_) {
      return null;
    }
  }
}

/// Simple password hashing using HMAC-SHA256 + per-user salt.
class VaultPassword {
  static final String _pepper = const String.fromEnvironment(
    'VAULT_PWD_PEPPER',
    defaultValue: 'vault-dev-pepper',
  );

  static String hash(String password) {
    final rand = Random.secure();
    final salt = _b64url(
      List<int>.generate(16, (_) => rand.nextInt(256)),
    );
    final digest = Hmac(
      sha256,
      utf8.encode('$_pepper$salt'),
    ).convert(utf8.encode(password));
    return '$salt\$${digest.bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join()}';
  }

  static bool verify(String password, String stored) {
    final parts = stored.split('\$');
    if (parts.length != 2) return false;
    final salt = parts[0];
    final expected = parts[1];
    final digest = Hmac(
      sha256,
      utf8.encode('$_pepper$salt'),
    ).convert(utf8.encode(password));
    final actual = digest.bytes
        .map((b) => b.toRadixString(16).padLeft(2, '0'))
        .join();
    return actual == expected;
  }

  static String _b64url(List<int> bytes) =>
      base64Url.encode(bytes).replaceAll('=', '');
}
