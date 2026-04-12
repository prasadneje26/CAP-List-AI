// ============================================================
// File: mobile-app/lib/screens/login_screen.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../main.dart' show AppTheme;

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey  = GlobalKey<FormState>();
  final _email    = TextEditingController();
  final _password = TextEditingController();
  bool _loading   = false;
  String? _error;
  bool _obscure   = true;

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    try {
      await AuthService.login(_email.text.trim(), _password.text);
      if (mounted) Navigator.pushReplacementNamed(context, '/dashboard');
    } catch (e) {
      setState(() { _error = e.toString(); });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),

              // Logo
              Center(
                child: Column(children: [
                  const Text('◈', style: TextStyle(fontSize: 44, color: AppTheme.amber)),
                  const SizedBox(height: 8),
                  Text('Welcome back',
                    style: Theme.of(context).textTheme.displayLarge),
                  const SizedBox(height: 6),
                  Text('Sign in to your CAP counseling account',
                    style: Theme.of(context).textTheme.bodyMedium),
                ]),
              ),

              const SizedBox(height: 40),

              if (_error != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.danger.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.danger.withOpacity(0.3)),
                  ),
                  child: Text(_error!, style: const TextStyle(color: Color(0xFFF87171), fontSize: 13)),
                ),

              Form(
                key: _formKey,
                child: Column(children: [
                  TextFormField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(labelText: 'Email address'),
                    validator: (v) => v!.contains('@') ? null : 'Enter a valid email',
                  ),
                  const SizedBox(height: 14),
                  TextFormField(
                    controller: _password,
                    obscureText: _obscure,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      suffixIcon: IconButton(
                        icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility,
                          color: AppTheme.gray2, size: 18),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      ),
                    ),
                    validator: (v) => v!.length >= 6 ? null : 'Password too short',
                  ),
                  const SizedBox(height: 24),
                  _loading
                    ? const CircularProgressIndicator(color: AppTheme.amber)
                    : ElevatedButton(onPressed: _login, child: const Text('Sign in →')),
                ]),
              ),

              const SizedBox(height: 24),
              Center(
                child: GestureDetector(
                  onTap: () => Navigator.pushReplacementNamed(context, '/register'),
                  child: RichText(text: const TextSpan(
                    text: "Don't have an account? ",
                    style: TextStyle(color: AppTheme.gray2, fontSize: 14),
                    children: [TextSpan(text: 'Create one free', style: TextStyle(color: AppTheme.amber, fontWeight: FontWeight.w600))],
                  )),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() { _email.dispose(); _password.dispose(); super.dispose(); }
}
