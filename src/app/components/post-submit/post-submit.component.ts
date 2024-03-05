import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../core/services/post.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-post-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './post-submit.component.html',
  styleUrl: './post-submit.component.scss',
})
export class PostSubmitComponent {
  selectedFileName = '';

  postForm = this.fb.group({
    content: [
      '',
      [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(1500),
      ],
    ],
    image: [''],
  });

  constructor(private fb: FormBuilder, private postService: PostService) {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.selectedFileName = file.name;
      this.postForm.patchValue({ image: file });
    }
  }

  removeFile() {
    this.selectedFileName = '';
    this.postForm.patchValue({ image: null });
  }

  submitPost() {
    if (this.postForm.valid) {
      this.postService.submitPost(
        <string>this.postForm.value.content,
        () => {
          this.postForm.reset();
        },
        <string>this.postForm.value.image
      );
    }
  }
}
