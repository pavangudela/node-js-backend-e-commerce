package com.E_commerce.exception;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest,
                                                  ErrorAttributeOptions options) {
        Map<String, Object> errorAttributes = super.getErrorAttributes(webRequest, options);

        // Only customize 403 Forbidden
        int status = (int) errorAttributes.get("status");
        if (status == 403) {
            errorAttributes.put("message", "Access denied. Insufficient permissions");
        }

        return errorAttributes;
    }
}
