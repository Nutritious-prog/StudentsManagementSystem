package com.example.demo.student;

import lombok.*;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor // @Data could replace all of this annotations but we don't want our fields to be final
public class Student {
    private Long id;
    private String name;
    private String email;
    private Gender gender;
}
