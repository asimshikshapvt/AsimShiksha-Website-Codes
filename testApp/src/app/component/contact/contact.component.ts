import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  isSubmitted = false;
  isAnimating = false;
  isSubmitting = false;
  hasError = false;

  formData = {
    name: '',
    phone: '',
    email: '',
    country: '',
    message: ''
  };

  submitForm(form: NgForm) {
    if (form.valid && !this.isAnimating && !this.isSubmitting) {
      this.isAnimating = true;
      this.isSubmitting = true;
      this.hasError = false;
      
      // Trigger the paper plane animation
      setTimeout(() => {
        this.onSubmit(form);
      }, 4000); // Wait for animation to complete
    }
  }

  async onSubmit(form: NgForm) {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', this.formData.name);
      formData.append('phone', this.formData.phone);
      formData.append('email', this.formData.email);
      formData.append('country', this.formData.country);
      formData.append('message', this.formData.message);
      formData.append('_subject', 'New Contact Form Submission');

      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/xgvlqpge', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success - show thank you message
        this.isSubmitted = true;
        this.resetFormData();
        form.resetForm();
      } else {
        // Error from Formspree
        this.hasError = true;
      }
    } catch (error) {
      // Network or other error
      console.error('Form submission error:', error);
      this.hasError = true;
    } finally {
      this.isAnimating = false;
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.isAnimating = false;
    this.isSubmitting = false;
    this.hasError = false;
    this.resetFormData();
  }

  private resetFormData() {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      country: '',
      message: ''
    };
  }
}