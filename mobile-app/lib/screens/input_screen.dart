// ============================================================
// File: mobile-app/lib/screens/input_screen.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart' show AppTheme;

const _branches  = ['Computer Engineering','Information Technology','Electronics & Telecommunication','Mechanical Engineering','Civil Engineering','Electrical Engineering','AI & Data Science'];
const _categories = ['OPEN','OBC','SC','ST','EWS','TFWS','PWD'];
const _locations = ['Pune','Mumbai','Nashik','Aurangabad','Nagpur','Kolhapur','Sangli'];

class InputScreen extends StatefulWidget {
  const InputScreen({super.key});
  @override
  State<InputScreen> createState() => _InputScreenState();
}

class _InputScreenState extends State<InputScreen> {
  final _formKey  = GlobalKey<FormState>();
  String _examType   = 'CET';
  String _category   = 'OPEN';
  String _gender     = '';
  String _collegeType = 'Any';
  final _percentile  = TextEditingController();
  final _budget      = TextEditingController();
  final _university  = TextEditingController();
  List<String> _branches  = [];
  List<String> _locations = [];
  bool _loading = false;
  String? _error, _success;

  void _toggleBranch(String b) => setState(() =>
    _branches.contains(b) ? _branches.remove(b) : _branches.add(b));

  void _toggleLocation(String l) => setState(() =>
    _locations.contains(l) ? _locations.remove(l) : _locations.add(l));

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; _success = null; });
    final body = {
      'percentile':           double.tryParse(_percentile.text) ?? 0,
      'exam_type':            _examType,
      'category':             _category,
      'gender':               _gender.isNotEmpty ? _gender : null,
      'home_university':      _university.text.isNotEmpty ? _university.text : null,
      'branch_preferences':   _branches,
      'location_preferences': _locations,
      'college_type':         _collegeType,
      'budget_max':           _budget.text.isNotEmpty ? int.tryParse(_budget.text) : null,
    };
    try {
      try {
        await ApiService.post('/student/', body);
      } catch (e) {
        if (e is ApiException && e.statusCode == 409) {
          await ApiService.put('/student/profile', body);
        } else { rethrow; }
      }
      setState(() => _success = 'Profile saved! Go to Dashboard to run prediction.');
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Academic Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(children: [
            if (_error   != null) _Alert(msg: _error!,   isError: true),
            if (_success != null) _Alert(msg: _success!, isError: false),

            // Exam details
            _Section(title: 'Exam Details', children: [
              TextFormField(
                controller: _percentile,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(labelText: 'Percentile (0–100)'),
                validator: (v) {
                  final d = double.tryParse(v ?? '');
                  return (d != null && d >= 0 && d <= 100) ? null : 'Enter a valid percentile';
                },
              ),
              const SizedBox(height: 12),
              _DropRow(label: 'Exam Type', value: _examType, items: ['CET','JEE'],
                onChanged: (v) => setState(() => _examType = v!)),
              const SizedBox(height: 12),
              _DropRow(label: 'Category', value: _category, items: _categories,
                onChanged: (v) => setState(() => _category = v!)),
              const SizedBox(height: 12),
              _DropRow(label: 'Gender', value: _gender.isNotEmpty ? _gender : null,
                items: ['Male','Female','Other'],
                hint: 'Select…',
                onChanged: (v) => setState(() => _gender = v ?? '')),
            ]),

            const SizedBox(height: 12),

            // Branch preferences
            _Section(title: 'Branch Preferences', children: [
              const Text('Tap in order of preference', style: TextStyle(color: AppTheme.gray2, fontSize: 12)),
              const SizedBox(height: 10),
              Wrap(spacing: 8, runSpacing: 8, children: const_branches.map((b) {
                final idx    = _branches.indexOf(b);
                final active = idx >= 0;
                return GestureDetector(
                  onTap: () => _toggleBranch(b),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: active ? AppTheme.amber.withOpacity(0.15) : Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(99),
                      border: Border.all(color: active ? AppTheme.amber : Colors.white24),
                    ),
                    child: Text(
                      active ? '${idx+1}. $b' : b,
                      style: TextStyle(fontSize: 12, color: active ? AppTheme.amber : AppTheme.gray2),
                    ),
                  ),
                );
              }).toList()),
            ]),

            const SizedBox(height: 12),

            // Location preferences
            _Section(title: 'Location & Budget', children: [
              Wrap(spacing: 8, runSpacing: 8, children: _locations_all.map((l) {
                final active = _locations.contains(l);
                return GestureDetector(
                  onTap: () => _toggleLocation(l),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: active ? AppTheme.amber.withOpacity(0.15) : Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(99),
                      border: Border.all(color: active ? AppTheme.amber : Colors.white24),
                    ),
                    child: Text(l, style: TextStyle(fontSize: 12, color: active ? AppTheme.amber : AppTheme.gray2)),
                  ),
                );
              }).toList()),
              const SizedBox(height: 12),
              _DropRow(label: 'College Type', value: _collegeType,
                items: ['Any','Government','Aided','Unaided','Autonomous'],
                onChanged: (v) => setState(() => _collegeType = v!)),
              const SizedBox(height: 12),
              TextFormField(
                controller: _budget,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max Annual Fees (₹ optional)'),
              ),
            ]),

            const SizedBox(height: 20),
            _loading
              ? const CircularProgressIndicator(color: AppTheme.amber)
              : ElevatedButton(onPressed: _save, child: const Text('Save Profile →')),
            const SizedBox(height: 24),
          ]),
        ),
      ),
    );
  }

  static const const_branches   = _branches_list;
  static const _branches_list   = ['Computer Engineering','Information Technology','Electronics & Telecommunication','Mechanical Engineering','Civil Engineering','Electrical Engineering','AI & Data Science'];
  static const _locations_all   = ['Pune','Mumbai','Nashik','Aurangabad','Nagpur','Kolhapur','Sangli'];

  @override
  void dispose() { _percentile.dispose(); _budget.dispose(); _university.dispose(); super.dispose(); }
}

class _Section extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _Section({required this.title, required this.children});
  @override
  Widget build(BuildContext context) => Card(child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      const SizedBox(height: 14),
      ...children,
    ]),
  ));
}

class _DropRow extends StatelessWidget {
  final String label;
  final String? value, hint;
  final List<String> items;
  final void Function(String?) onChanged;
  const _DropRow({required this.label, this.value, required this.items, required this.onChanged, this.hint});
  @override
  Widget build(BuildContext context) => DropdownButtonFormField<String>(
    value: value,
    decoration: InputDecoration(labelText: label),
    dropdownColor: AppTheme.navyMid,
    hint: hint != null ? Text(hint!, style: const TextStyle(color: AppTheme.gray3)) : null,
    items: items.map((i) => DropdownMenuItem(value: i, child: Text(i))).toList(),
    onChanged: onChanged,
  );
}

class _Alert extends StatelessWidget {
  final String msg;
  final bool   isError;
  const _Alert({required this.msg, required this.isError});
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 12),
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: (isError ? AppTheme.danger : AppTheme.success).withOpacity(0.12),
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: (isError ? AppTheme.danger : AppTheme.success).withOpacity(0.3)),
    ),
    child: Text(msg, style: TextStyle(color: isError ? const Color(0xFFF87171) : const Color(0xFF4ADE80), fontSize: 13)),
  );
}
