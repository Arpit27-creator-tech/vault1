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
import 'package:serverpod/serverpod.dart' as _is;
import 'package:vault1_server/src/generated/protocol.dart' as _il7ruxfp;

abstract class VaultUser
    implements _is.TableRow<int?>, _is.ProtocolSerialization {
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
          : _il7ruxfp.Protocol().deserialize<List<String>>(
              jsonSerialization['badges'],
            ),
    );
  }

  static final t = VaultUserTable();

  static const db = VaultUserRepository._();

  @override
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

  @override
  _is.Table<int?> get table => t;

  /// Returns a shallow copy of this [VaultUser]
  /// with some or all fields replaced by the given arguments.
  @_is.useResult
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

  static VaultUserInclude include() {
    return VaultUserInclude._();
  }

  static VaultUserIncludeList includeList({
    _is.WhereExpressionBuilder<VaultUserTable>? where,
    int? limit,
    int? offset,
    _is.OrderByBuilder<VaultUserTable>? orderBy,
    _is.OrderByListBuilder<VaultUserTable>? orderByList,
    VaultUserInclude? include,
  }) {
    return VaultUserIncludeList._(
      where: where,
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(VaultUser.t),
      orderByList: orderByList?.call(VaultUser.t),
      include: include,
    );
  }

  @override
  String toString() {
    return _is.SerializationManager.encode(this);
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
  @_is.useResult
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

class VaultUserUpdateTable extends _is.UpdateTable<VaultUserTable> {
  VaultUserUpdateTable(super.table);

  _is.ColumnValue<String, String> callsign(String value) => _is.ColumnValue(
    table.callsign,
    value,
  );

  _is.ColumnValue<String, String> email(String value) => _is.ColumnValue(
    table.email,
    value,
  );

  _is.ColumnValue<String, String> passwordHash(String value) => _is.ColumnValue(
    table.passwordHash,
    value,
  );

  _is.ColumnValue<int, int> xp(int value) => _is.ColumnValue(
    table.xp,
    value,
  );

  _is.ColumnValue<int, int> level(int value) => _is.ColumnValue(
    table.level,
    value,
  );

  _is.ColumnValue<String, String> vaultRole(String value) => _is.ColumnValue(
    table.vaultRole,
    value,
  );

  _is.ColumnValue<String, String> rank(String value) => _is.ColumnValue(
    table.rank,
    value,
  );

  _is.ColumnValue<String, String> avatarUrl(String? value) => _is.ColumnValue(
    table.avatarUrl,
    value,
  );

  _is.ColumnValue<int, int> missionsCompleted(int value) => _is.ColumnValue(
    table.missionsCompleted,
    value,
  );

  _is.ColumnValue<int, int> vaultsCracked(int value) => _is.ColumnValue(
    table.vaultsCracked,
    value,
  );

  _is.ColumnValue<int, int> alarmsTripped(int value) => _is.ColumnValue(
    table.alarmsTripped,
    value,
  );

  _is.ColumnValue<double, double> winRate(double value) => _is.ColumnValue(
    table.winRate,
    value,
  );

  _is.ColumnValue<String, String> fastestTime(String value) => _is.ColumnValue(
    table.fastestTime,
    value,
  );

  _is.ColumnValue<int, int> csMastery(int value) => _is.ColumnValue(
    table.csMastery,
    value,
  );

  _is.ColumnValue<int, int> physicsMastery(int value) => _is.ColumnValue(
    table.physicsMastery,
    value,
  );

  _is.ColumnValue<int, int> chemMastery(int value) => _is.ColumnValue(
    table.chemMastery,
    value,
  );

  _is.ColumnValue<int, int> mathMastery(int value) => _is.ColumnValue(
    table.mathMastery,
    value,
  );

  _is.ColumnValue<List<String>, List<String>> badges(List<String>? value) =>
      _is.ColumnValue(
        table.badges,
        value,
      );
}

class VaultUserTable extends _is.Table<int?> {
  VaultUserTable({super.tableRelation}) : super(tableName: 'vault_users') {
    updateTable = VaultUserUpdateTable(this);
    callsign = _is.ColumnString(
      'callsign',
      this,
    );
    email = _is.ColumnString(
      'email',
      this,
    );
    passwordHash = _is.ColumnString(
      'passwordHash',
      this,
    );
    xp = _is.ColumnInt(
      'xp',
      this,
      hasDefault: true,
    );
    level = _is.ColumnInt(
      'level',
      this,
      hasDefault: true,
    );
    vaultRole = _is.ColumnString(
      'vaultRole',
      this,
      hasDefault: true,
    );
    rank = _is.ColumnString(
      'rank',
      this,
      hasDefault: true,
    );
    avatarUrl = _is.ColumnString(
      'avatarUrl',
      this,
    );
    missionsCompleted = _is.ColumnInt(
      'missionsCompleted',
      this,
      hasDefault: true,
    );
    vaultsCracked = _is.ColumnInt(
      'vaultsCracked',
      this,
      hasDefault: true,
    );
    alarmsTripped = _is.ColumnInt(
      'alarmsTripped',
      this,
      hasDefault: true,
    );
    winRate = _is.ColumnDouble(
      'winRate',
      this,
      hasDefault: true,
    );
    fastestTime = _is.ColumnString(
      'fastestTime',
      this,
      hasDefault: true,
    );
    csMastery = _is.ColumnInt(
      'csMastery',
      this,
      hasDefault: true,
    );
    physicsMastery = _is.ColumnInt(
      'physicsMastery',
      this,
      hasDefault: true,
    );
    chemMastery = _is.ColumnInt(
      'chemMastery',
      this,
      hasDefault: true,
    );
    mathMastery = _is.ColumnInt(
      'mathMastery',
      this,
      hasDefault: true,
    );
    badges = _is.ColumnSerializable<List<String>>(
      'badges',
      this,
    );
  }

  late final VaultUserUpdateTable updateTable;

  late final _is.ColumnString callsign;

  late final _is.ColumnString email;

  late final _is.ColumnString passwordHash;

  late final _is.ColumnInt xp;

  late final _is.ColumnInt level;

  late final _is.ColumnString vaultRole;

  late final _is.ColumnString rank;

  late final _is.ColumnString avatarUrl;

  late final _is.ColumnInt missionsCompleted;

  late final _is.ColumnInt vaultsCracked;

  late final _is.ColumnInt alarmsTripped;

  late final _is.ColumnDouble winRate;

  late final _is.ColumnString fastestTime;

  late final _is.ColumnInt csMastery;

  late final _is.ColumnInt physicsMastery;

  late final _is.ColumnInt chemMastery;

  late final _is.ColumnInt mathMastery;

  late final _is.ColumnSerializable<List<String>> badges;

  @override
  List<_is.Column> get columns => [
    id,
    callsign,
    email,
    passwordHash,
    xp,
    level,
    vaultRole,
    rank,
    avatarUrl,
    missionsCompleted,
    vaultsCracked,
    alarmsTripped,
    winRate,
    fastestTime,
    csMastery,
    physicsMastery,
    chemMastery,
    mathMastery,
    badges,
  ];
}

class VaultUserInclude extends _is.IncludeObject {
  VaultUserInclude._();

  @override
  Map<String, _is.Include?> get includes => {};

  @override
  _is.Table<int?> get table => VaultUser.t;
}

class VaultUserIncludeList extends _is.IncludeList {
  VaultUserIncludeList._({
    _is.WhereExpressionBuilder<VaultUserTable>? where,
    super.limit,
    super.offset,
    super.orderBy,
    super.orderByList,
    super.include,
  }) {
    super.where = where?.call(VaultUser.t);
  }

  @override
  Map<String, _is.Include?> get includes => include?.includes ?? {};

  @override
  _is.Table<int?> get table => VaultUser.t;
}

class VaultUserRepository {
  const VaultUserRepository._();

  /// Returns a list of [VaultUser]s matching the given query parameters.
  ///
  /// Use [where] to specify which items to include in the return value.
  /// If none is specified, all items will be returned.
  ///
  /// To specify the order of the items use [orderBy] or [orderByList]
  /// when sorting by multiple columns.
  ///
  /// The maximum number of items can be set by [limit]. If no limit is set,
  /// all items matching the query will be returned.
  ///
  /// [offset] defines how many items to skip, after which [limit] (or all)
  /// items are read from the database.
  ///
  /// ```dart
  /// var persons = await Persons.db.find(
  ///   session,
  ///   where: (t) => t.lastName.equals('Jones'),
  ///   orderBy: (t) => t.firstName,
  ///   limit: 100,
  /// );
  /// ```
  Future<List<VaultUser>> find(
    _is.DatabaseSession session, {
    _is.WhereExpressionBuilder<VaultUserTable>? where,
    int? limit,
    int? offset,
    _is.OrderByBuilder<VaultUserTable>? orderBy,
    _is.OrderByListBuilder<VaultUserTable>? orderByList,
    _is.Transaction? transaction,
    _is.LockMode? lockMode,
    _is.LockBehavior? lockBehavior,
  }) async {
    return session.db.find<VaultUser>(
      where: where?.call(VaultUser.t),
      orderBy: orderBy?.call(VaultUser.t),
      orderByList: orderByList?.call(VaultUser.t),
      limit: limit,
      offset: offset,
      transaction: transaction,
      lockMode: lockMode,
      lockBehavior: lockBehavior,
    );
  }

  /// Returns the first matching [VaultUser] matching the given query parameters.
  ///
  /// Use [where] to specify which items to include in the return value.
  /// If none is specified, all items will be returned.
  ///
  /// To specify the order use [orderBy] or [orderByList]
  /// when sorting by multiple columns.
  ///
  /// [offset] defines how many items to skip, after which the next one will be picked.
  ///
  /// ```dart
  /// var youngestPerson = await Persons.db.findFirstRow(
  ///   session,
  ///   where: (t) => t.lastName.equals('Jones'),
  ///   orderBy: (t) => t.age,
  /// );
  /// ```
  Future<VaultUser?> findFirstRow(
    _is.DatabaseSession session, {
    _is.WhereExpressionBuilder<VaultUserTable>? where,
    int? offset,
    _is.OrderByBuilder<VaultUserTable>? orderBy,
    _is.OrderByListBuilder<VaultUserTable>? orderByList,
    _is.Transaction? transaction,
    _is.LockMode? lockMode,
    _is.LockBehavior? lockBehavior,
  }) async {
    return session.db.findFirstRow<VaultUser>(
      where: where?.call(VaultUser.t),
      orderBy: orderBy?.call(VaultUser.t),
      orderByList: orderByList?.call(VaultUser.t),
      offset: offset,
      transaction: transaction,
      lockMode: lockMode,
      lockBehavior: lockBehavior,
    );
  }

  /// Finds a single [VaultUser] by its [id] or null if no such row exists.
  Future<VaultUser?> findById(
    _is.DatabaseSession session,
    int id, {
    _is.Transaction? transaction,
    _is.LockMode? lockMode,
    _is.LockBehavior? lockBehavior,
  }) async {
    return session.db.findById<VaultUser>(
      id,
      transaction: transaction,
      lockMode: lockMode,
      lockBehavior: lockBehavior,
    );
  }

  /// Inserts all [VaultUser]s in the list and returns the inserted rows.
  ///
  /// The returned [VaultUser]s will have their `id` fields set.
  ///
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// insert, none of the rows will be inserted.
  ///
  /// If [ignoreConflicts] is set to `true`, rows that conflict with existing
  /// rows are silently skipped, and only the successfully inserted rows are
  /// returned.
  ///
  /// If [noReturn] is set to `true`, the inserted rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultUser>> insert(
    _is.DatabaseSession session,
    List<VaultUser> rows, {
    _is.Transaction? transaction,
    bool ignoreConflicts = false,
    bool noReturn = false,
  }) async {
    return session.db.insert<VaultUser>(
      rows,
      transaction: transaction,
      ignoreConflicts: ignoreConflicts,
      noReturn: noReturn,
    );
  }

  /// Inserts a single [VaultUser] and returns the inserted row.
  ///
  /// The returned [VaultUser] will have its `id` field set.
  Future<VaultUser> insertRow(
    _is.DatabaseSession session,
    VaultUser row, {
    _is.Transaction? transaction,
  }) async {
    return session.db.insertRow<VaultUser>(
      row,
      transaction: transaction,
    );
  }

  /// Upserts all [VaultUser]s in the list and returns the resulting rows.
  ///
  /// If a row conflicts on the given [conflictColumns], the existing row is
  /// updated with the new values. Otherwise, a new row is inserted.
  ///
  /// If [updateColumns] is provided, only those columns will be updated on
  /// conflict. If null, all non-conflict, non-id columns are updated.
  ///
  /// If [updateWhere] is provided, the update only applies to rows matching the
  /// given expression. Conflicting rows that don't match are skipped and not
  /// returned, so the resulting list may be shorter than [rows].
  ///
  /// The returned [VaultUser]s will have their `id` fields set.
  ///
  /// This is an atomic operation, meaning that if one of the rows fails,
  /// none of the rows will be affected.
  ///
  /// If [noReturn] is set to `true`, the resulting rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultUser>> upsert(
    _is.DatabaseSession session,
    List<VaultUser> rows, {
    required _is.ColumnSelections<VaultUserTable> conflictColumns,
    _is.ColumnSelections<VaultUserTable>? updateColumns,
    _is.WhereExpressionBuilder<VaultUserTable>? updateWhere,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.upsert<VaultUser>(
      rows,
      conflictColumns: conflictColumns(VaultUser.t),
      updateColumns: updateColumns?.call(VaultUser.t),
      updateWhere: updateWhere?.call(VaultUser.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Upserts a single [VaultUser] and returns the resulting row.
  ///
  /// If the row conflicts on the given [conflictColumns], the existing row is
  /// updated. Otherwise, a new row is inserted.
  ///
  /// If [updateColumns] is provided, only those columns will be updated on
  /// conflict. If null, all non-conflict, non-id columns are updated.
  ///
  /// If [updateWhere] is provided, the update only applies when the existing
  /// row matches the expression. Returns `null` if no row was affected — for
  /// example when [updateWhere] does not match the conflicting row.
  ///
  /// The returned [VaultUser] will have its `id` field set.
  Future<VaultUser?> upsertRow(
    _is.DatabaseSession session,
    VaultUser row, {
    required _is.ColumnSelections<VaultUserTable> conflictColumns,
    _is.ColumnSelections<VaultUserTable>? updateColumns,
    _is.WhereExpressionBuilder<VaultUserTable>? updateWhere,
    _is.Transaction? transaction,
  }) async {
    return session.db.upsertRow<VaultUser>(
      row,
      conflictColumns: conflictColumns(VaultUser.t),
      updateColumns: updateColumns?.call(VaultUser.t),
      updateWhere: updateWhere?.call(VaultUser.t),
      transaction: transaction,
    );
  }

  /// Updates all [VaultUser]s in the list and returns the updated rows. If
  /// [columns] is provided, only those columns will be updated. Defaults to
  /// all columns.
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// update, none of the rows will be updated.
  ///
  /// If [noReturn] is set to `true`, the updated rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultUser>> update(
    _is.DatabaseSession session,
    List<VaultUser> rows, {
    _is.ColumnSelections<VaultUserTable>? columns,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.update<VaultUser>(
      rows,
      columns: columns?.call(VaultUser.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Updates a single [VaultUser]. The row needs to have its id set.
  /// Optionally, a list of [columns] can be provided to only update those
  /// columns. Defaults to all columns.
  Future<VaultUser> updateRow(
    _is.DatabaseSession session,
    VaultUser row, {
    _is.ColumnSelections<VaultUserTable>? columns,
    _is.Transaction? transaction,
  }) async {
    return session.db.updateRow<VaultUser>(
      row,
      columns: columns?.call(VaultUser.t),
      transaction: transaction,
    );
  }

  /// Updates a single [VaultUser] by its [id] with the specified [columnValues].
  /// Returns the updated row or null if no row with the given id exists.
  Future<VaultUser?> updateById(
    _is.DatabaseSession session,
    int id, {
    required _is.ColumnValueListBuilder<VaultUserUpdateTable> columnValues,
    _is.Transaction? transaction,
  }) async {
    return session.db.updateById<VaultUser>(
      id,
      columnValues: columnValues(VaultUser.t.updateTable),
      transaction: transaction,
    );
  }

  /// Updates all [VaultUser]s matching the [where] expression with the specified [columnValues].
  /// Returns the list of updated rows.
  ///
  /// If [noReturn] is set to `true`, the updated rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultUser>> updateWhere(
    _is.DatabaseSession session, {
    required _is.ColumnValueListBuilder<VaultUserUpdateTable> columnValues,
    required _is.WhereExpressionBuilder<VaultUserTable> where,
    int? limit,
    int? offset,
    _is.OrderByBuilder<VaultUserTable>? orderBy,
    _is.OrderByListBuilder<VaultUserTable>? orderByList,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.updateWhere<VaultUser>(
      columnValues: columnValues(VaultUser.t.updateTable),
      where: where(VaultUser.t),
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(VaultUser.t),
      orderByList: orderByList?.call(VaultUser.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Deletes all [VaultUser]s in the list and returns the deleted rows.
  ///
  /// To specify the order of the returned rows use [orderBy] or [orderByList]
  /// when sorting by multiple columns.
  ///
  /// This is an atomic operation, meaning that if one of the rows fail to
  /// be deleted, none of the rows will be deleted.
  ///
  /// If [noReturn] is set to `true`, the deleted rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultUser>> delete(
    _is.DatabaseSession session,
    List<VaultUser> rows, {
    _is.OrderByBuilder<VaultUserTable>? orderBy,
    _is.OrderByListBuilder<VaultUserTable>? orderByList,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.delete<VaultUser>(
      rows,
      orderBy: orderBy?.call(VaultUser.t),
      orderByList: orderByList?.call(VaultUser.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Deletes a single [VaultUser].
  Future<VaultUser> deleteRow(
    _is.DatabaseSession session,
    VaultUser row, {
    _is.Transaction? transaction,
  }) async {
    return session.db.deleteRow<VaultUser>(
      row,
      transaction: transaction,
    );
  }

  /// Deletes all rows matching the [where] expression.
  ///
  /// To specify the order of the returned rows use [orderBy] or [orderByList]
  /// when sorting by multiple columns.
  ///
  /// If [noReturn] is set to `true`, the deleted rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultUser>> deleteWhere(
    _is.DatabaseSession session, {
    required _is.WhereExpressionBuilder<VaultUserTable> where,
    _is.OrderByBuilder<VaultUserTable>? orderBy,
    _is.OrderByListBuilder<VaultUserTable>? orderByList,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.deleteWhere<VaultUser>(
      where: where(VaultUser.t),
      orderBy: orderBy?.call(VaultUser.t),
      orderByList: orderByList?.call(VaultUser.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Counts the number of rows matching the [where] expression. If omitted,
  /// will return the count of all rows in the table.
  Future<int> count(
    _is.DatabaseSession session, {
    _is.WhereExpressionBuilder<VaultUserTable>? where,
    int? limit,
    _is.Transaction? transaction,
  }) async {
    return session.db.count<VaultUser>(
      where: where?.call(VaultUser.t),
      limit: limit,
      transaction: transaction,
    );
  }

  /// Acquires row-level locks on [VaultUser] rows matching the [where] expression.
  Future<void> lockRows(
    _is.DatabaseSession session, {
    required _is.WhereExpressionBuilder<VaultUserTable> where,
    required _is.LockMode lockMode,
    required _is.Transaction transaction,
    _is.LockBehavior lockBehavior = _is.LockBehavior.wait,
  }) async {
    return session.db.lockRows<VaultUser>(
      where: where(VaultUser.t),
      lockMode: lockMode,
      lockBehavior: lockBehavior,
      transaction: transaction,
    );
  }
}
