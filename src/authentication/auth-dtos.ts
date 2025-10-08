export class CreateUserDto {
  username!: string;
  password!: string;
  email!: string;
}

export class LoginDto {
  username!: string;
  password!: string;
}
