package com.E_commerce.dto;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private  String  oldPassword;
    private String newPassword;

}
