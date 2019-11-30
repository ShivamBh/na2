import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;
}

export class RegisterDTO {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  seller?: boolean;
}

// export interface LoginDTO {
//   username: string;

//   password: string;
// }

// export interface RegisterDTO {
//   username: string;

//   password: string;

//   seller?: boolean;
// }
