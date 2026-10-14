import 'package:flutter/material.dart';

import 'client.dart';
import 'vault/screens/vault_hub_screen.dart';
import 'vault/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeClient();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'V.A.U.L.T - Serverpod',
      debugShowCheckedModeBanner: false,
      theme: VaultTheme.darkTheme,
      home: const VaultHubScreen(),
    );
  }
}
