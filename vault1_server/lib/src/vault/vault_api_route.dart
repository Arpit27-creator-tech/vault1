import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:serverpod/serverpod.dart';
import 'package:vault1_server/src/generated/protocol.dart';
import 'package:vault1_server/src/vault/vault_auth_utils.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Send Brevo Email
// ─────────────────────────────────────────────────────────────────────────────
Future<void> _sendBrevoEmail({
  required String to,
  required String code,
  required Session session,
}) async {
  final apiKey =
      Platform.environment['BREVO_API_KEY'] ??
      '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';
  final senderEmail =
      Platform.environment['BREVO_SENDER_EMAIL'] ?? 'vault.game.hq@gmail.com';

  try {
    final client = HttpClient();
    final req = await client.postUrl(
      Uri.parse('https://api.brevo.com/v3/smtp/email'),
    );
    req.headers.set('api-key', apiKey);
    req.headers.set('Content-Type', 'application/json');
    req.headers.set('Accept', 'application/json');

    final payload = jsonEncode({
      'sender': {'name': 'V.A.U.L.T HQ', 'email': senderEmail},
      'to': [
        {'email': to},
      ],
      'subject': '🔑 V.A.U.L.T Verification Code: $code',
      'htmlContent':
          '''
        <div style="background-color:#051811; color:#F0FDF4; font-family:sans-serif; padding:32px; border-radius:12px; max-width:500px; margin:0 auto; border:1px solid #10B981;">
          <h2 style="color:#10B981; letter-spacing:2px; margin-top:0;">V.A.U.L.T CLEARANCE PROTOCOL</h2>
          <p style="font-size:16px; color:#A7F3D0;">Your 6-digit agent clearance code is:</p>
          <div style="background-color:#03140C; border:2px dashed #10B981; border-radius:8px; padding:18px; text-align:center; font-size:32px; font-weight:bold; letter-spacing:8px; color:#34D399; margin:20px 0;">
            $code
          </div>
          <p style="color:#6EE7B7; font-size:13px;">This code expires in 10 minutes. Do not share this clearance sequence with unauthorized personnel.</p>
        </div>
      ''',
      'textContent':
          'Your V.A.U.L.T verification code is: $code (valid for 10 minutes)',
    });

    req.write(payload);
    final res = await req.close();
    session.log(
      '📧 [BREVO] Sent verification email to $to (status: ${res.statusCode})',
      level: LogLevel.info,
    );
    client.close();
  } catch (e) {
    session.log('⚠️ [BREVO] Email dispatch note: $e', level: LogLevel.info);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: JSON response shorthand
// ─────────────────────────────────────────────────────────────────────────────
Headers _corsHeaders() => Headers.build((h) {
  h['Access-Control-Allow-Origin'] = ['*'];
  h['Access-Control-Allow-Headers'] = ['Content-Type, Authorization'];
  h['Access-Control-Allow-Methods'] = ['GET, POST, PUT, DELETE, OPTIONS'];
});

Response _json(Object data, {int status = 200}) => Response(
  status,
  body: Body.fromString(jsonEncode(data), mimeType: MimeType.json),
  headers: _corsHeaders(),
);

Response _err(String message, {int status = 400}) =>
    _json({'error': message, 'message': message}, status: status);

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build the user map the React app expects
// ─────────────────────────────────────────────────────────────────────────────
Map<String, dynamic> _userToMap(VaultUser u) {
  final idStr = (u.id?.toString() ?? '1').padLeft(8, '0');
  final agentId = 'VAULT-$idStr';
  return {
    'id': u.id.toString(),
    'agentId': agentId,
    'agent_id': agentId,
    'username': u.callsign,
    'callsign': u.callsign,
    'email': u.email,
    'role': u.vaultRole,
    'level': u.level,
    'xp': u.xp,
    'rank': u.rank,
    'avatar':
        u.avatarUrl ??
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    'badges': u.badges ?? <String>['Forest Ranger'],
    'notificationPrefs': {
      'heistInvites': true,
      'weeklySummary': true,
      'friendRequests': true,
    },
    'equippedTheme': 'default',
    'skillPoints': 0,
    'unlockedPerks': <dynamic>[],
    'loyaltyPoints': 1000,
    'stats': {
      'missionsCompleted': u.missionsCompleted,
      'winRate': u.winRate,
      'vaultsCracked': u.vaultsCracked,
      'alarmsTripped': u.alarmsTripped,
      'fastestTime': u.fastestTime,
      'csMastery': u.csMastery,
      'physicsMastery': u.physicsMastery,
      'chemMastery': u.chemMastery,
      'mathMastery': u.mathMastery,
      'cryptoMastery': 50,
    },
    'history': <dynamic>[],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: extract Bearer token from request
// ─────────────────────────────────────────────────────────────────────────────
int? _userId(Request request) {
  final auth = request.headers.authorization;
  if (auth is BearerAuthorizationHeader) {
    return VaultJwt.verify(auth.token);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: random 6-digit OTP
// ─────────────────────────────────────────────────────────────────────────────
String _otp() => (100000 + Random.secure().nextInt(900000)).toString();

// ─────────────────────────────────────────────────────────────────────────────
// Main route: handles /api/** via injectIn
// ─────────────────────────────────────────────────────────────────────────────
class VaultApiRoute extends Route {
  @override
  Future<Result> handleCall(Session session, Request request) async {
    return Response.notFound();
  }

  @override
  void injectIn(RelicRouter router) {
    // CORS pre-flight
    router.options('/', _preflight);
    router.options('/**', _preflight);

    // Auth endpoints
    router.post('/auth/send-verification', _sendVerification);
    router.post('/auth/verify-code', _verifyCode);
    router.post('/auth/register', _register);
    router.post('/auth/login', _login);
    router.get('/auth/me', _me);
    router.put('/auth/change-password', _changePassword);
    router.post('/auth/forgot-password', _forgotPassword);
    router.post('/auth/reset-password', _resetPassword);

    // Misc: health
    router.get('/health', _health);

    // Stub endpoints that the React UI uses — return empty arrays / objects
    // so the app doesn't break when the backend is still being built out.
    router.get('/leaderboard', _leaderboardStub);
    router.get('/leaderboard/weekly', _leaderboardStub);
    router.get('/missions', _missionsStub);
    router.get('/missions/**', _missionStub);
    router.post('/missions', _createMissionStub);
    router.post('/missions/**', _createMissionStub);
    router.get('/heists', _heistStub);
    router.get('/heists/**', _heistStub);
    router.post('/heists', _heistStub);
    router.post('/heists/**', _heistStub);
    router.put('/heists/**', _heistStub);
    router.get('/users/**', _userStub);
    router.put('/users/**', _userStub);
    router.get('/friends', _friendsStub);
    router.get('/friends/**', _friendsStub);
    router.post('/friends/**', _friendsStub);
    router.put('/friends/**', _friendsStub);
    router.delete('/friends/**', _friendsStub);
  }

  // ── CORS pre-flight ──────────────────────────────────────────────────────
  Future<Result> _preflight(Request request) async => _json({}, status: 204);

  // ── Health ───────────────────────────────────────────────────────────────
  Future<Result> _health(Request request) async =>
      _json({'status': 'ok', 'server': 'vault1'});

  // ── POST /api/auth/send-verification ────────────────────────────────────
  Future<Result> _sendVerification(Request request) async {
    final session = await request.session;
    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final email = (body['email'] as String?)?.trim().toLowerCase();
    if (email == null || email.isEmpty) return _err('Email is required');

    // Check if email already registered
    final existing = await VaultUser.db.findFirstRow(
      session,
      where: (t) => t.email.equals(email),
    );
    if (existing != null) {
      return _err('User exists with this email', status: 409);
    }

    // Delete any previous OTP for this email
    await VaultOtp.db.deleteWhere(
      session,
      where: (t) => t.email.equals(email),
    );

    final code = _otp();
    final expiresAt = DateTime.now().toUtc().add(const Duration(minutes: 10));
    await VaultOtp.db.insertRow(
      session,
      VaultOtp(email: email, code: code, expiresAt: expiresAt),
    );

    session.log(
      '🔐 [VAULT OTP] $email → $code (dev preview)',
      level: LogLevel.info,
    );

    // Also dispatch email asynchronously in background via Brevo
    unawaited(_sendBrevoEmail(to: email, code: code, session: session));

    // Return previewCode so the UI shows the "Backup Code" button
    return _json({
      'success': true,
      'message': '6-digit clearance code sent to $email',
      'previewCode': code,
    });
  }

  // ── POST /api/auth/verify-code ───────────────────────────────────────────
  Future<Result> _verifyCode(Request request) async {
    final session = await request.session;
    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final email = (body['email'] as String?)?.trim().toLowerCase();
    final code = (body['code'] as String?)?.trim();
    if (email == null || code == null) return _err('Email and code required');

    final otp = await VaultOtp.db.findFirstRow(
      session,
      where: (t) => t.email.equals(email) & t.code.equals(code),
    );
    if (otp == null) return _err('Invalid or expired code', status: 401);
    if (otp.expiresAt.isBefore(DateTime.now().toUtc())) {
      await VaultOtp.db.deleteWhere(
        session,
        where: (t) => t.email.equals(email),
      );
      return _err('Code has expired', status: 401);
    }

    return _json({
      'success': true,
      'verified': true,
      'valid': true,
      'message': 'Email verified successfully!',
    });
  }

  // ── POST /api/auth/register ──────────────────────────────────────────────
  Future<Result> _register(Request request) async {
    final session = await request.session;
    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final username = (body['username'] as String?)?.trim();
    final email = (body['email'] as String?)?.trim().toLowerCase();
    final password = body['password'] as String?;
    final code = (body['code'] as String?)?.trim();

    if (username == null || username.isEmpty) return _err('Username required');
    if (email == null || email.isEmpty) return _err('Email required');
    if (password == null || password.length < 6) {
      return _err('Password too short');
    }

    // If a code was provided, validate it
    if (code != null && code.isNotEmpty) {
      final otp = await VaultOtp.db.findFirstRow(
        session,
        where: (t) => t.email.equals(email) & t.code.equals(code),
      );
      if (otp == null) {
        return _err('Invalid or expired verification code', status: 401);
      }
      if (otp.expiresAt.isBefore(DateTime.now().toUtc())) {
        return _err('Verification code expired', status: 401);
      }
      // Clean up used OTP
      await VaultOtp.db.deleteWhere(
        session,
        where: (t) => t.email.equals(email),
      );
    }

    // Check uniqueness
    final existing = await VaultUser.db.findFirstRow(
      session,
      where: (t) => t.email.equals(email),
    );
    if (existing != null) return _err('Email already registered', status: 409);

    final existingCallsign = await VaultUser.db.findFirstRow(
      session,
      where: (t) => t.callsign.ilike(username),
    );
    if (existingCallsign != null) {
      return _err('Callsign already taken', status: 409);
    }

    final user = await VaultUser.db.insertRow(
      session,
      VaultUser(
        callsign: username,
        email: email,
        passwordHash: VaultPassword.hash(password),
        xp: 300, // starter bonus
        level: 1,
        vaultRole: 'Canopy Hacker',
        rank: 'Junior Ranger',
        badges: ['Junior Ranger', 'New Explorer'],
      ),
    );

    final token = VaultJwt.issue(user.id!);
    return _json({
      'success': true,
      'token': token,
      'user': _userToMap(user),
      'message': 'Registration successful',
    }, status: 201);
  }

  // ── POST /api/auth/login ─────────────────────────────────────────────────
  Future<Result> _login(Request request) async {
    final session = await request.session;
    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final identifier = (body['identifier'] as String?)?.trim();
    final password = body['password'] as String?;
    if (identifier == null || password == null) {
      return _err('Credentials required');
    }

    final isEmail = identifier.contains('@');
    final user = isEmail
        ? await VaultUser.db.findFirstRow(
            session,
            where: (t) => t.email.equals(identifier.toLowerCase()),
          )
        : await VaultUser.db.findFirstRow(
            session,
            where: (t) => t.callsign.ilike(identifier),
          );

    if (user == null || !VaultPassword.verify(password, user.passwordHash)) {
      return _err('Invalid credentials', status: 401);
    }

    final token = VaultJwt.issue(user.id!);
    return _json({
      'success': true,
      'token': token,
      'user': _userToMap(user),
    });
  }

  // ── GET /api/auth/me ─────────────────────────────────────────────────────
  Future<Result> _me(Request request) async {
    final session = await request.session;
    final userId = _userId(request);
    if (userId == null) return _err('Unauthorized', status: 401);

    final user = await VaultUser.db.findById(session, userId);
    if (user == null) return _err('User not found', status: 404);
    return _json({
      'success': true,
      'user': _userToMap(user),
    });
  }

  // ── PUT /api/auth/change-password ────────────────────────────────────────
  Future<Result> _changePassword(Request request) async {
    final session = await request.session;
    final userId = _userId(request);
    if (userId == null) return _err('Unauthorized', status: 401);

    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final current = body['currentPassword'] as String?;
    final next = body['newPassword'] as String?;
    if (current == null || next == null) return _err('Passwords required');
    if ((next).length < 6) return _err('New password too short');

    final user = await VaultUser.db.findById(session, userId);
    if (user == null) return _err('User not found', status: 404);
    if (!VaultPassword.verify(current, user.passwordHash)) {
      return _err('Current password incorrect', status: 401);
    }

    user.passwordHash = VaultPassword.hash(next);
    await VaultUser.db.updateRow(session, user);
    return _json({'message': 'Password updated'});
  }

  // ── POST /api/auth/forgot-password ──────────────────────────────────────
  Future<Result> _forgotPassword(Request request) async {
    final session = await request.session;
    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final email = (body['email'] as String?)?.trim().toLowerCase();
    if (email == null) return _err('Email required');

    final user = await VaultUser.db.findFirstRow(
      session,
      where: (t) => t.email.equals(email),
    );
    if (user == null) {
      // Don't reveal if email exists
      return _json({
        'message': 'If that email is registered, a reset code was sent',
      });
    }

    await VaultOtp.db.deleteWhere(session, where: (t) => t.email.equals(email));
    final code = _otp();
    await VaultOtp.db.insertRow(
      session,
      VaultOtp(
        email: email,
        code: code,
        expiresAt: DateTime.now().toUtc().add(const Duration(minutes: 15)),
      ),
    );

    session.log('🔑 [VAULT RESET] $email → $code', level: LogLevel.info);
    return _json({
      'message': 'Reset code sent',
      'previewCode': code,
      'resetToken': code,
    });
  }

  // ── POST /api/auth/reset-password ────────────────────────────────────────
  Future<Result> _resetPassword(Request request) async {
    final session = await request.session;
    final body =
        jsonDecode(await request.readAsString()) as Map<String, dynamic>;
    final email = (body['email'] as String?)?.trim().toLowerCase();
    final code = (body['code'] as String? ?? body['resetToken'] as String?)
        ?.trim();
    final newPassword = body['newPassword'] as String?;

    if (email == null || code == null || newPassword == null) {
      return _err('Email, code, and new password required');
    }
    if (newPassword.length < 6) return _err('Password too short');

    final otp = await VaultOtp.db.findFirstRow(
      session,
      where: (t) => t.email.equals(email) & t.code.equals(code),
    );
    if (otp == null || otp.expiresAt.isBefore(DateTime.now().toUtc())) {
      return _err('Invalid or expired reset code', status: 401);
    }

    final user = await VaultUser.db.findFirstRow(
      session,
      where: (t) => t.email.equals(email),
    );
    if (user == null) return _err('User not found', status: 404);

    user.passwordHash = VaultPassword.hash(newPassword);
    await VaultUser.db.updateRow(session, user);
    await VaultOtp.db.deleteWhere(session, where: (t) => t.email.equals(email));

    final token = VaultJwt.issue(user.id!);
    return _json({
      'token': token,
      'user': _userToMap(user),
      'message': 'Password reset',
    });
  }

  // ── Stub routes (return empty data) ─────────────────────────────────────
  Future<Result> _leaderboardStub(Request req) async =>
      _json({'entries': <dynamic>[], 'total': 0});

  Future<Result> _missionsStub(Request req) async =>
      _json({'missions': <dynamic>[], 'total': 0});

  Future<Result> _missionStub(Request req) async => _json({'mission': null});

  Future<Result> _createMissionStub(Request req) async => _json({
    'id': 'local-${DateTime.now().millisecondsSinceEpoch}',
  }, status: 201);

  Future<Result> _heistStub(Request req) async =>
      _json({'heist': null, 'session': null});

  Future<Result> _userStub(Request req) async {
    final session = await req.session;
    final uid = _userId(req);
    VaultUser? user;
    if (uid != null) {
      user = await VaultUser.db.findById(session, uid);
    }

    String? requestedTheme;
    if (req.method.name.toUpperCase() == 'PUT') {
      try {
        final bodyText = await req.readAsString();
        if (bodyText.isNotEmpty) {
          final body = jsonDecode(bodyText) as Map<String, dynamic>;
          requestedTheme =
              (body['equipped_theme'] ?? body['equippedTheme']) as String?;
        }
      } catch (_) {}
    }

    final userMap = user != null ? _userToMap(user) : null;
    if (userMap != null && requestedTheme != null) {
      userMap['equippedTheme'] = requestedTheme;
    }

    return _json({
      'user': userMap ?? {'equippedTheme': requestedTheme ?? 'default'},
      'stats':
          userMap?['stats'] ??
          {
            'missionsCompleted': 0,
            'winRate': 100,
            'vaultsCracked': 0,
            'alarmsTripped': 0,
            'fastestTime': '--',
            'csMastery': 50,
            'physicsMastery': 50,
            'chemMastery': 50,
            'mathMastery': 50,
            'cryptoMastery': 50,
          },
      'unlocked': ['default', 'ember', 'crimson', 'azure', 'golden'],
      'unlockedThemes': ['default', 'ember', 'crimson', 'azure', 'golden'],
      'skillPoints': 0,
      'unlockedPerks': <dynamic>[],
    });
  }

  Future<Result> _friendsStub(Request req) async =>
      _json({'friends': <dynamic>[]});
}
