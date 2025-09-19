package com.E_commerce.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseAndRequest {
    private Long id;
    private String name;
    private String contactNumber;
    private Long pinCode;
    private String state;
    private String area;
    private String landMark;
    private String buildingName;
    @JsonProperty("isDefault")
    private boolean isDefault;
}
