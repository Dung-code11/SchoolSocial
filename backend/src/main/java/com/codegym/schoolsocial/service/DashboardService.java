package com.codegym.schoolsocial.service;

import com.codegym.schoolsocial.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboardForCurrentUser();
}