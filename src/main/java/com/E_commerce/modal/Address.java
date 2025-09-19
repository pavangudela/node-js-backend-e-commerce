package com.E_commerce.modal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String contactNumber;
    @Column(nullable = false)
    private Long pinCode;
    @Column(nullable = false)
    private String state;
    @Column(nullable = false)
    private String Area;
    private String landMark;
    private String buildingName;
    private boolean  isDefault=false;
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = true)
    private User user;
}

