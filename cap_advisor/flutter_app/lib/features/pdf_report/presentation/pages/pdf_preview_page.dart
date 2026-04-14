import 'package:flutter/material.dart';

class PDFPreviewPage extends StatelessWidget {
  const PDFPreviewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('PDF Preview')),
      body: const Center(child: Text('PDF preview will be available here once generated.')),
    );
  }
}
