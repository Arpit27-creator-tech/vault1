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

abstract class VaultOtp
    implements _is.TableRow<int?>, _is.ProtocolSerialization {
  VaultOtp._({
    this.id,
    required this.email,
    required this.code,
    required this.expiresAt,
  });

  factory VaultOtp({
    int? id,
    required String email,
    required String code,
    required DateTime expiresAt,
  }) = _VaultOtpImpl;

  factory VaultOtp.fromJson(Map<String, dynamic> jsonSerialization) {
    return VaultOtp(
      id: jsonSerialization['id'] as int?,
      email: jsonSerialization['email'] as String,
      code: jsonSerialization['code'] as String,
      expiresAt: _is.DateTimeJsonExtension.fromJson(
        jsonSerialization['expiresAt'],
      ),
    );
  }

  static final t = VaultOtpTable();

  static const db = VaultOtpRepository._();

  @override
  int? id;

  String email;

  String code;

  DateTime expiresAt;

  @override
  _is.Table<int?> get table => t;

  /// Returns a shallow copy of this [VaultOtp]
  /// with some or all fields replaced by the given arguments.
  @_is.useResult
  VaultOtp copyWith({
    int? id,
    String? email,
    String? code,
    DateTime? expiresAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      '__className__': 'VaultOtp',
      if (id != null) 'id': id,
      'email': email,
      'code': code,
      'expiresAt': expiresAt.toJson(),
    };
  }

  @override
  Map<String, dynamic> toJsonForProtocol() {
    return {
      '__className__': 'VaultOtp',
      if (id != null) 'id': id,
      'email': email,
      'code': code,
      'expiresAt': expiresAt.toJson(),
    };
  }

  static VaultOtpInclude include() {
    return VaultOtpInclude._();
  }

  static VaultOtpIncludeList includeList({
    _is.WhereExpressionBuilder<VaultOtpTable>? where,
    int? limit,
    int? offset,
    _is.OrderByBuilder<VaultOtpTable>? orderBy,
    _is.OrderByListBuilder<VaultOtpTable>? orderByList,
    VaultOtpInclude? include,
  }) {
    return VaultOtpIncludeList._(
      where: where,
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(VaultOtp.t),
      orderByList: orderByList?.call(VaultOtp.t),
      include: include,
    );
  }

  @override
  String toString() {
    return _is.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _VaultOtpImpl extends VaultOtp {
  _VaultOtpImpl({
    int? id,
    required String email,
    required String code,
    required DateTime expiresAt,
  }) : super._(
         id: id,
         email: email,
         code: code,
         expiresAt: expiresAt,
       );

  /// Returns a shallow copy of this [VaultOtp]
  /// with some or all fields replaced by the given arguments.
  @_is.useResult
  @override
  VaultOtp copyWith({
    Object? id = _Undefined,
    String? email,
    String? code,
    DateTime? expiresAt,
  }) {
    return VaultOtp(
      id: id is int? ? id : this.id,
      email: email ?? this.email,
      code: code ?? this.code,
      expiresAt: expiresAt ?? this.expiresAt,
    );
  }
}

class VaultOtpUpdateTable extends _is.UpdateTable<VaultOtpTable> {
  VaultOtpUpdateTable(super.table);

  _is.ColumnValue<String, String> email(String value) => _is.ColumnValue(
    table.email,
    value,
  );

  _is.ColumnValue<String, String> code(String value) => _is.ColumnValue(
    table.code,
    value,
  );

  _is.ColumnValue<DateTime, DateTime> expiresAt(DateTime value) =>
      _is.ColumnValue(
        table.expiresAt,
        value,
      );
}

class VaultOtpTable extends _is.Table<int?> {
  VaultOtpTable({super.tableRelation}) : super(tableName: 'vault_otps') {
    updateTable = VaultOtpUpdateTable(this);
    email = _is.ColumnString(
      'email',
      this,
    );
    code = _is.ColumnString(
      'code',
      this,
    );
    expiresAt = _is.ColumnDateTime(
      'expiresAt',
      this,
    );
  }

  late final VaultOtpUpdateTable updateTable;

  late final _is.ColumnString email;

  late final _is.ColumnString code;

  late final _is.ColumnDateTime expiresAt;

  @override
  List<_is.Column> get columns => [
    id,
    email,
    code,
    expiresAt,
  ];
}

class VaultOtpInclude extends _is.IncludeObject {
  VaultOtpInclude._();

  @override
  Map<String, _is.Include?> get includes => {};

  @override
  _is.Table<int?> get table => VaultOtp.t;
}

class VaultOtpIncludeList extends _is.IncludeList {
  VaultOtpIncludeList._({
    _is.WhereExpressionBuilder<VaultOtpTable>? where,
    super.limit,
    super.offset,
    super.orderBy,
    super.orderByList,
    super.include,
  }) {
    super.where = where?.call(VaultOtp.t);
  }

  @override
  Map<String, _is.Include?> get includes => include?.includes ?? {};

  @override
  _is.Table<int?> get table => VaultOtp.t;
}

class VaultOtpRepository {
  const VaultOtpRepository._();

  /// Returns a list of [VaultOtp]s matching the given query parameters.
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
  Future<List<VaultOtp>> find(
    _is.DatabaseSession session, {
    _is.WhereExpressionBuilder<VaultOtpTable>? where,
    int? limit,
    int? offset,
    _is.OrderByBuilder<VaultOtpTable>? orderBy,
    _is.OrderByListBuilder<VaultOtpTable>? orderByList,
    _is.Transaction? transaction,
    _is.LockMode? lockMode,
    _is.LockBehavior? lockBehavior,
  }) async {
    return session.db.find<VaultOtp>(
      where: where?.call(VaultOtp.t),
      orderBy: orderBy?.call(VaultOtp.t),
      orderByList: orderByList?.call(VaultOtp.t),
      limit: limit,
      offset: offset,
      transaction: transaction,
      lockMode: lockMode,
      lockBehavior: lockBehavior,
    );
  }

  /// Returns the first matching [VaultOtp] matching the given query parameters.
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
  Future<VaultOtp?> findFirstRow(
    _is.DatabaseSession session, {
    _is.WhereExpressionBuilder<VaultOtpTable>? where,
    int? offset,
    _is.OrderByBuilder<VaultOtpTable>? orderBy,
    _is.OrderByListBuilder<VaultOtpTable>? orderByList,
    _is.Transaction? transaction,
    _is.LockMode? lockMode,
    _is.LockBehavior? lockBehavior,
  }) async {
    return session.db.findFirstRow<VaultOtp>(
      where: where?.call(VaultOtp.t),
      orderBy: orderBy?.call(VaultOtp.t),
      orderByList: orderByList?.call(VaultOtp.t),
      offset: offset,
      transaction: transaction,
      lockMode: lockMode,
      lockBehavior: lockBehavior,
    );
  }

  /// Finds a single [VaultOtp] by its [id] or null if no such row exists.
  Future<VaultOtp?> findById(
    _is.DatabaseSession session,
    int id, {
    _is.Transaction? transaction,
    _is.LockMode? lockMode,
    _is.LockBehavior? lockBehavior,
  }) async {
    return session.db.findById<VaultOtp>(
      id,
      transaction: transaction,
      lockMode: lockMode,
      lockBehavior: lockBehavior,
    );
  }

  /// Inserts all [VaultOtp]s in the list and returns the inserted rows.
  ///
  /// The returned [VaultOtp]s will have their `id` fields set.
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
  Future<List<VaultOtp>> insert(
    _is.DatabaseSession session,
    List<VaultOtp> rows, {
    _is.Transaction? transaction,
    bool ignoreConflicts = false,
    bool noReturn = false,
  }) async {
    return session.db.insert<VaultOtp>(
      rows,
      transaction: transaction,
      ignoreConflicts: ignoreConflicts,
      noReturn: noReturn,
    );
  }

  /// Inserts a single [VaultOtp] and returns the inserted row.
  ///
  /// The returned [VaultOtp] will have its `id` field set.
  Future<VaultOtp> insertRow(
    _is.DatabaseSession session,
    VaultOtp row, {
    _is.Transaction? transaction,
  }) async {
    return session.db.insertRow<VaultOtp>(
      row,
      transaction: transaction,
    );
  }

  /// Upserts all [VaultOtp]s in the list and returns the resulting rows.
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
  /// The returned [VaultOtp]s will have their `id` fields set.
  ///
  /// This is an atomic operation, meaning that if one of the rows fails,
  /// none of the rows will be affected.
  ///
  /// If [noReturn] is set to `true`, the resulting rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultOtp>> upsert(
    _is.DatabaseSession session,
    List<VaultOtp> rows, {
    required _is.ColumnSelections<VaultOtpTable> conflictColumns,
    _is.ColumnSelections<VaultOtpTable>? updateColumns,
    _is.WhereExpressionBuilder<VaultOtpTable>? updateWhere,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.upsert<VaultOtp>(
      rows,
      conflictColumns: conflictColumns(VaultOtp.t),
      updateColumns: updateColumns?.call(VaultOtp.t),
      updateWhere: updateWhere?.call(VaultOtp.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Upserts a single [VaultOtp] and returns the resulting row.
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
  /// The returned [VaultOtp] will have its `id` field set.
  Future<VaultOtp?> upsertRow(
    _is.DatabaseSession session,
    VaultOtp row, {
    required _is.ColumnSelections<VaultOtpTable> conflictColumns,
    _is.ColumnSelections<VaultOtpTable>? updateColumns,
    _is.WhereExpressionBuilder<VaultOtpTable>? updateWhere,
    _is.Transaction? transaction,
  }) async {
    return session.db.upsertRow<VaultOtp>(
      row,
      conflictColumns: conflictColumns(VaultOtp.t),
      updateColumns: updateColumns?.call(VaultOtp.t),
      updateWhere: updateWhere?.call(VaultOtp.t),
      transaction: transaction,
    );
  }

  /// Updates all [VaultOtp]s in the list and returns the updated rows. If
  /// [columns] is provided, only those columns will be updated. Defaults to
  /// all columns.
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// update, none of the rows will be updated.
  ///
  /// If [noReturn] is set to `true`, the updated rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultOtp>> update(
    _is.DatabaseSession session,
    List<VaultOtp> rows, {
    _is.ColumnSelections<VaultOtpTable>? columns,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.update<VaultOtp>(
      rows,
      columns: columns?.call(VaultOtp.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Updates a single [VaultOtp]. The row needs to have its id set.
  /// Optionally, a list of [columns] can be provided to only update those
  /// columns. Defaults to all columns.
  Future<VaultOtp> updateRow(
    _is.DatabaseSession session,
    VaultOtp row, {
    _is.ColumnSelections<VaultOtpTable>? columns,
    _is.Transaction? transaction,
  }) async {
    return session.db.updateRow<VaultOtp>(
      row,
      columns: columns?.call(VaultOtp.t),
      transaction: transaction,
    );
  }

  /// Updates a single [VaultOtp] by its [id] with the specified [columnValues].
  /// Returns the updated row or null if no row with the given id exists.
  Future<VaultOtp?> updateById(
    _is.DatabaseSession session,
    int id, {
    required _is.ColumnValueListBuilder<VaultOtpUpdateTable> columnValues,
    _is.Transaction? transaction,
  }) async {
    return session.db.updateById<VaultOtp>(
      id,
      columnValues: columnValues(VaultOtp.t.updateTable),
      transaction: transaction,
    );
  }

  /// Updates all [VaultOtp]s matching the [where] expression with the specified [columnValues].
  /// Returns the list of updated rows.
  ///
  /// If [noReturn] is set to `true`, the updated rows are not read back from
  /// the database and an empty list is returned. This avoids the overhead of
  /// transferring and deserializing the rows when the result is not needed.
  Future<List<VaultOtp>> updateWhere(
    _is.DatabaseSession session, {
    required _is.ColumnValueListBuilder<VaultOtpUpdateTable> columnValues,
    required _is.WhereExpressionBuilder<VaultOtpTable> where,
    int? limit,
    int? offset,
    _is.OrderByBuilder<VaultOtpTable>? orderBy,
    _is.OrderByListBuilder<VaultOtpTable>? orderByList,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.updateWhere<VaultOtp>(
      columnValues: columnValues(VaultOtp.t.updateTable),
      where: where(VaultOtp.t),
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(VaultOtp.t),
      orderByList: orderByList?.call(VaultOtp.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Deletes all [VaultOtp]s in the list and returns the deleted rows.
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
  Future<List<VaultOtp>> delete(
    _is.DatabaseSession session,
    List<VaultOtp> rows, {
    _is.OrderByBuilder<VaultOtpTable>? orderBy,
    _is.OrderByListBuilder<VaultOtpTable>? orderByList,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.delete<VaultOtp>(
      rows,
      orderBy: orderBy?.call(VaultOtp.t),
      orderByList: orderByList?.call(VaultOtp.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Deletes a single [VaultOtp].
  Future<VaultOtp> deleteRow(
    _is.DatabaseSession session,
    VaultOtp row, {
    _is.Transaction? transaction,
  }) async {
    return session.db.deleteRow<VaultOtp>(
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
  Future<List<VaultOtp>> deleteWhere(
    _is.DatabaseSession session, {
    required _is.WhereExpressionBuilder<VaultOtpTable> where,
    _is.OrderByBuilder<VaultOtpTable>? orderBy,
    _is.OrderByListBuilder<VaultOtpTable>? orderByList,
    _is.Transaction? transaction,
    bool noReturn = false,
  }) async {
    return session.db.deleteWhere<VaultOtp>(
      where: where(VaultOtp.t),
      orderBy: orderBy?.call(VaultOtp.t),
      orderByList: orderByList?.call(VaultOtp.t),
      transaction: transaction,
      noReturn: noReturn,
    );
  }

  /// Counts the number of rows matching the [where] expression. If omitted,
  /// will return the count of all rows in the table.
  Future<int> count(
    _is.DatabaseSession session, {
    _is.WhereExpressionBuilder<VaultOtpTable>? where,
    int? limit,
    _is.Transaction? transaction,
  }) async {
    return session.db.count<VaultOtp>(
      where: where?.call(VaultOtp.t),
      limit: limit,
      transaction: transaction,
    );
  }

  /// Acquires row-level locks on [VaultOtp] rows matching the [where] expression.
  Future<void> lockRows(
    _is.DatabaseSession session, {
    required _is.WhereExpressionBuilder<VaultOtpTable> where,
    required _is.LockMode lockMode,
    required _is.Transaction transaction,
    _is.LockBehavior lockBehavior = _is.LockBehavior.wait,
  }) async {
    return session.db.lockRows<VaultOtp>(
      where: where(VaultOtp.t),
      lockMode: lockMode,
      lockBehavior: lockBehavior,
      transaction: transaction,
    );
  }
}
