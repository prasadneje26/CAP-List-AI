// ============================================================
// File: mobile-app/lib/screens/register_screen.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../main.dart' show AppTheme;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey  = GlobalKey<FormState>();
  final _name     = TextEditingController();
  final _email    = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    try {
      await AuthService.register(_name.text.trim(), _email.text.trim(), _password.text);
      if (mounted) Navigator.pushReplacementNamed(context, '/input');
    } catch (e) {
      setState(() => _error = e.toString());
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
          child: Column(children: [
            const SizedBox(height: 32),
            Center(child: Column(children: [
              const Text('◈', style: TextStyle(fontSize: 44, color: AppTheme.amber)),
              const SizedBox(height: 8),
              Text('Create account', style: Theme.of(context).textTheme.displayLarge),
              const SizedBox(height: 6),
              Text('Free — no credit card needed', style: Theme.of(context).textTheme.bodyMedium),
            ])),
            const SizedBox(height: 36),
            if (_error != null)
              Container(
                margin: const EdgeInsets.only(bottom: 14),
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
                  controller: _name,
                  decoration: const InputDecoration(labelText: 'Full name'),
                  validator: (v) => v!.length >= 2 ? null : 'Name too short',
                ),
                const SizedBox(height: 14),
                TextFormField(
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Email address'),
                  validator: (v) => v!.contains('@') ? null : 'Enter a valid email',
                ),
                const SizedBox(height: 14),
                TextFormField(
                  controller: _password,
                  obscureText: true,
                  decoration: const InputDecoration(labelText: 'Password (min 8 chars, A-Z, a-z, 0-9)'),
                  validator: (v) => v!.length >= 8 ? null : 'Min 8 characters',
                ),
                const SizedBox(height: 24),
                _loading
                  ? const CircularProgressIndicator(color: AppTheme.amber)
                  : ElevatedButton(onPressed: _register, child: const Text('Get Started →')),
              ]),
            ),
            const SizedBox(height: 20),
            GestureDetector(
              onTap: () => Navigator.pushReplacementNamed(context, '/login'),
              child: RichText(text: const TextSpan(
                text: 'Already have an account? ',
                style: TextStyle(color: AppTheme.gray2, fontSize: 14),
                children: [TextSpan(text: 'Sign in', style: TextStyle(color: AppTheme.amber, fontWeight: FontWeight.w600))],
              )),
            ),
          ]),
        ),
      ),
    );
  }

  @override
  void dispose() { _name.dispose(); _email.dispose(); _password.dispose(); super.dispose(); }
}
