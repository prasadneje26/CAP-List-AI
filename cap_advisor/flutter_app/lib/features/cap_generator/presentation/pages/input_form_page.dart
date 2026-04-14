import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/di/injection_container.dart';
import '../bloc/cap_bloc.dart';
import '../bloc/cap_event.dart';

class InputFormPage extends StatefulWidget {
  const InputFormPage({super.key});

  @override
  State<InputFormPage> createState() => _InputFormPageState();
}

class _InputFormPageState extends State<InputFormPage> {
  final _formKey = GlobalKey<FormState>();
  double percentile = 75.0;
  String category = 'Open';
  List<String> branches = ['Computer Engineering'];
  String location = 'Pune';
  String collegeType = 'Autonomous';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CAP Preference Builder')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(children: [
          Text('Percentile', style: AppTextStyles.body),
          Slider(value: percentile, min: 50, max: 100, divisions: 500, label: percentile.toStringAsFixed(2), onChanged: (value) => setState(() => percentile = value)),
          const SizedBox(height: 10),
          DropdownButtonFormField<String>(
            value: category,
            decoration: const InputDecoration(labelText: 'Category'),
            items: ['Open', 'OBC', 'SC', 'ST', 'NT', 'VJNT'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(),
            onChanged: (value) => setState(() => category = value ?? category),
          ),
          const SizedBox(height: 16),
          Wrap(spacing: 8, children: ['Computer Engineering', 'Information Technology', 'Electronics & Telecom', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'].map((branch) {
            final selected = branches.contains(branch);
            return ChoiceChip(
              label: Text(branch),
              selected: selected,
              onSelected: (isSelected) {
                setState(() {
                  if (isSelected) {
                    branches.add(branch);
                  } else {
                    branches.remove(branch);
                  }
                });
              },
            );
          }).toList()),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: location,
            decoration: const InputDecoration(labelText: 'Location'),
            items: ['Pune', 'Mumbai', 'Nagpur', 'Aurangabad', 'Nashik'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(),
            onChanged: (value) => setState(() => location = value ?? location),
          ),
          const SizedBox(height: 16),
          Row(children: ['Autonomous', 'Non-Autonomous'].map((type) => Expanded(
            child: ChoiceChip(
              label: Text(type),
              selected: collegeType == type,
              onSelected: (_) => setState(() => collegeType = type),
            ),
          )).toList()),
          const Spacer(),
          ElevatedButton(
            onPressed: () {
              if (branches.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Select at least one branch')));
                return;
              }
              final payload = {
                'percentile': percentile,
                'category': category,
                'branches': branches,
                'location': location,
                'collegeType': collegeType
              };
              context.read<CAPBloc>().add(GenerateCAPListRequested(payload));
              Navigator.pushNamed(context, '/home/results');
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, minimumSize: const Size.fromHeight(52)),
            child: const Text('Generate CAP List'),
          )
        ]),
      ),
    );
  }
}
