type ValidationChoices = {
  Required?: boolean;
};

/* validate("poll_name", poll_name).required("Poll Name is required")
     .length(3, "Poll Name must be longer than 3 characters")
*/

export class validate {
  // The field's value, for use in the various validation functions
  private fieldValue: string;
  // State that determines if field is still valid
  private valid: boolean;
  // State that will hold the error to return
  private error: string;

  constructor(fieldValue: string) {
    this.fieldValue = fieldValue;
    this.valid = true;
    this.error = "";
  }

  public required(error: string) {
    if (this.valid) {
      if (this.fieldValue.length < 1) {
        this.valid = false;
        this.error = error;
      }
    }
    return this;
  }

  public minlength(minlength: number, error: string) {
    if (this.valid) {
      if (this.fieldValue.length < minlength) {
        this.valid = false;
        this.error = error;
      }
    }
    return this;
  }

  public maxlength(maxlength: number, error: string) {
    if (this.valid) {
      if (this.fieldValue.length > maxlength) {
        this.valid = false;
        this.error = error;
      }
    }
    return this;
  }

  public email(error: string) {
    if (this.valid) {
      if (!/^\S+@\S+\.\S+$/.test(this.fieldValue)) {
        this.valid = false;
        this.error = error;
      }
    }
    return this;
  }

  public run() {
    return {
      valid: this.valid,
      error: this.error,
    };
  }
}
