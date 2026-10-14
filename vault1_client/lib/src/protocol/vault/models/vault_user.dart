/* AUTOMATICALLY GENERATED CODE DO NOT MODIFY */
/*   To generate run: "serverpod generate"    */

// ignore_for_file: implementation_imports
// ignore_for_file: library_private_types_in_public_api
// ignore_for_file: non_constant_identifier_names
// ignore_for_file: public_member_api_docs
// ignore_for_file: type_literal_in_constant_pattern
// ignore_for_file: use_super_parameters
// ignore_for_file: invalid_use_of_internal_member

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:serverpod_client/serverpod_client.dart' as _isc;
import 'package:vault1_client/src/protocol/protocol.dart' as _iitiy0tt;

abstract class VaultUser
    implements _isc.SerializableModel, _isc.ProtocolSerialization {
  VaultUser._({
    this.id,
    required this.callsign,
    required this.email,
    required this.passwordHash,
    int? xp,
    int? level,
    String? vaultRole,
    String? rank,
    this.avatarUrl,
    int? missionsCompleted,
    int? vaultsCracked,
    int? alarmsTripped,
    double? winRate,
    String? fastestTime,
    int? csMastery,
    int? physicsMastery,
    int? chemMastery,
    int? mathMastery,
    this.badges,
  }) : xp = xp ?? 0,
       level = level ?? 1,
       vaultRole = vaultRole ?? 'Canopy Hacker',
       rank = rank ?? 'Junior Ranger',
       missionsCompleted = missionsCompleted ?? 0,
       vaultsCracked = vaultsCracked ?? 0,
       alarmsTripped = alarmsTripped ?? 0,
       winRate = winRate ?? 100.0,
       fastestTime = fastestTime ?? '--',
       csMastery = csMastery ?? 75,
       physicsMastery = physicsMastery ?? 70,
       chemMastery = chemMastery ?? 70,
       mathMastery = mathMastery ?? 75;

  factory VaultUser({
    int? id,
    required String callsign,
    required String email,
    required String passwordHash,
    int? xp,
    int? level,
    String? vaultRole,
    String? rank,
    String? avatarUrl,
    int? missionsCompleted,
    int? vaultsCracked,
    int? alarmsTripped,
    double? winRate,
    String? fastestTime,
    int? csMastery,
    int? physicsMastery,
    int? chemMastery,
    int? mathMastery,
    List<String>? badges,
  }) = _VaultUserImpl;

  factory VaultUser.fromJson(Map<String, dynamic> jsonSerialization) {
    return VaultUser(
      id: jsonSerialization['id'] as int?,
      callsign: jsonSerialization['callsign'] as String,
      email: jsonSerialization['email'] as String,
      passwordHash: jsonSerialization['passwordHash'] as String,
      xp: jsonSerialization['xp'] as int?,
      level: jsonSerialization['level'] as int?,
      vaultRole: jsonSerialization['vaultRole'] as String?,
      rank: jsonSerialization['rank'] as String?,
      avatarUrl: jsonSerialization['avatarUrl'] as String?,
      missionsCompleted: jsonSerialization['missionsCompleted'] as int?,
      vaultsCracked: jsonSerialization['vaultsCracked'] as int?,
      alarmsTripped: jsonSerialization['alarmsTripped'] as int?,
      winRate: (jsonSerialization['winRate'] as num?)?.toDouble(),
      fastestTime: jsonSerialization['fastestTime'] as String?,
      csMastery: jsonSerialization['csMastery'] as int?,
      physicsMastery: jsonSerialization['physicsMastery'] as int?,
      chemMastery: jsonSerialization['chemMastery'] as int?,
      mathMastery: jsonSerialization['mathMastery'] as int?,
      badges: jsonSerialization['badges'] == null
          ? null
          : _iitiy0tt.Protocol().deserialize<List<String>>(
              jsonSerialization['badges'],
            ),
    );
  }

  /// The database id, set if the object has been inserted into the
  /// database or if it has been fetched from the database. Otherwise,
  /// the id will be null.
  int? id;

  String callsign;

  String email;

  String passwordHash;

  int xp;

  int level;

  String vaultRole;

  String rank;

  String? avatarUrl;

  int missionsCompleted;

  int vaultsCracked;

  int alarmsTripped;

  double winRate;

  String fastestTime;

  int csMastery;

  int physicsMastery;

  int chemMastery;

  int mathMastery;

  List<String>? badges;

  /// Returns a shallow copy of this [VaultUser]
  /// with some or all fields replaced by the given arguments.
  @_isc.useResult
  VaultUser copyWith({
    int? id,
    String? callsign,
    String? email,
    String? passwordHash,
    int? xp,
    int? level,
    String? vaultRole,
    String? rank,
    String? avatarUrl,
    int? missionsCompleted,
    int? vaultsCracked,
    int? alarmsTripped,
    double? winRate,
    String? fastestTime,
    int? csMastery,
    int? physicsMastery,
    int? chemMastery,
    int? mathMastery,
    List<String>? badges,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      '__className__': 'VaultUser',
      if (id != null) 'id': id,
      'callsign': callsign,
      'email': email,
      'passwordHash': passwordHash,
      'xp': xp,
      'level': level,
      'vaultRole': vaultRole,
      'rank': rank,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
      'missionsCompleted': missionsCompleted,
      'vaultsCracked': vaultsCracked,
      'alarmsTripped': alarmsTripped,
      'winRate': winRate,
      'fastestTime': fastestTime,
      'csMastery': csMastery,
      'physicsMastery': physicsMastery,
      'chemMastery': chemMastery,
      'mathMastery': mathMastery,
      if (badges != null) 'badges': badges?.toJson(),
    };
  }

  @override
  Map<String, dynamic> toJsonForProtocol() {
    return {
      '__className__': 'VaultUser',
      if (id != null) 'id': id,
      'callsign': callsign,
      'email': email,
      'passwordHash': passwordHash,
      'xp': xp,
      'level': level,
      'vaultRole': vaultRole,
      'rank': rank,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
      'missionsCompleted': missionsCompleted,
      'vaultsCracked': vaultsCracked,
      'alarmsTripped': alarmsTripped,
      'winRate': winRate,
      'fastestTime': fastestTime,
      'csMastery': csMastery,
      'physicsMastery': physicsMastery,
      'chemMastery': chemMastery,
      'mathMastery': mathMastery,
      if (badges != null) 'badges': badges?.toJson(),
    };
  }

  @override
  String toString() {
    return _isc.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _VaultUserImpl extends VaultUser {
  _VaultUserImpl({
    int? id,
    required String callsign,
    required String email,
    required String passwordHash,
    int? xp,
    int? level,
    String? vaultRole,
    String? rank,
    String? avatarUrl,
    int? missionsCompleted,
    int? vaultsCracked,
    int? alarmsTripped,
    double? winRate,
    String? fastestTime,
    int? csMastery,
    int? physicsMastery,
    int? chemMastery,
    int? mathMastery,
    List<String>? badges,
  }) : super._(
         id: id,
         callsign: callsign,
         email: email,
         passwordHash: passwordHash,
         xp: xp,
         level: level,
         vaultRole: vaultRole,
         rank: rank,
         avatarUrl: avatarUrl,
         missionsCompleted: missionsCompleted,
         vaultsCracked: vaultsCracked,
         alarmsTripped: alarmsTripped,
         winRate: winRate,
         fastestTime: fastestTime,
         csMastery: csMastery,
         physicsMastery: physicsMastery,
         chemMastery: chemMastery,
         mathMastery: mathMastery,
         badges: badges,
       );

  /// Returns a shallow copy of this [VaultUser]
  /// with some or all fields replaced by the given arguments.
  @_isc.useResult
  @override
  VaultUser copyWith({
    Object? id = _Undefined,
    String? callsign,
    String? email,
    String? passwordHash,
    int? xp,
    int? level,
    String? vaultRole,
    String? rank,
    Object? avatarUrl = _Undefined,
    int? missionsCompleted,
    int? vaultsCracked,
    int? alarmsTripped,
    double? winRate,
    String? fastestTime,
    int? csMastery,
    int? physicsMastery,
    int? chemMastery,
    int? mathMastery,
    Object? badges = _Undefined,
  }) {
    return VaultUser(
      id: id is int? ? id : this.id,
      callsign: callsign ?? this.callsign,
      email: email ?? this.email,
      passwordHash: passwordHash ?? this.passwordHash,
      xp: xp ?? this.xp,
      level: level ?? this.level,
      vaultRole: vaultRole ?? this.vaultRole,
      rank: rank ?? this.rank,
      avatarUrl: avatarUrl is String? ? avatarUrl : this.avatarUrl,
      missionsCompleted: missionsCompleted ?? this.missionsCompleted,
      vaultsCracked: vaultsCracked ?? this.vaultsCracked,
      alarmsTripped: alarmsTripped ?? this.alarmsTripped,
      winRate: winRate ?? this.winRate,
      fastestTime: fastestTime ?? this.fastestTime,
      csMastery: csMastery ?? this.csMastery,
      physicsMastery: physicsMastery ?? this.physicsMastery,
      chemMastery: chemMastery ?? this.chemMastery,
      mathMastery: mathMastery ?? this.mathMastery,
      badges: badges is List<String>?
          ? badges
          : this.badges?.map((e0) => e0).toList(),
    );
  }
}
