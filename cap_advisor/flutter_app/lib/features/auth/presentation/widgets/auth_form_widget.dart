import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../domain/entities/user_entity.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';

class AuthFormWidget extends StatefulWidget {
  final bool isLogin;
  const AuthFormWidget({super.key, required this.isLogin});

  @override
  State<AuthFormWidget> createState() => _AuthFormWidgetState();
}

class _AuthFormWidgetState extends State<AuthFormWidget> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String email = '';
  String password = '';
  String? phone;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(children: [
        if (!widget.isLogin)
          TextFormField(
            decoration: const InputDecoration(labelText: 'Name'),
            onChanged: (value) => name = value,
            validator: (value) => value == null || value.isEmpty ? 'Name required' : null,
          ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(labelText: 'Email'),
          onChanged: (value) => email = value,
          validator: (value) => value == null || !value.contains('@') ? 'Valid email required' : null,
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(labelText: 'Password'),
          obscureText: true,
          onChanged: (value) => password = value,
          validator: (value) => value == null || value.length < 8 ? 'Password must be at least 8 characters' : null,
        ),
        if (!widget.isLogin) ...[
          const SizedBox(height: 16),
          TextFormField(
            decoration: const InputDecoration(labelText: 'Phone (optional)'),
            onChanged: (value) => phone = value,
          ),
        ],
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () {
            if (_formKey.currentState?.validate() ?? false) {
              if (widget.isLogin) {
                context.read<AuthBloc>().add(LoginRequested(email, password));
              } else {
                context.read<AuthBloc>().add(RegisterRequested(name, email, password, phone));
              }
            }
          },
          child: Text(widget.isLogin ? 'Login' : 'Register'),
        )
      ]),
    );
  }
}
