'use server';

import {fetcher} from "./fetcher";
import {notFound, redirect} from "next/navigation";
import {AuthUserDto, ToDoDto} from "@/types/userDto";
import {NotificationDto, UserNotificationDto} from "@/types/notificationDto";

export const getMe = async () => {
  const res = await fetcher('GET', `/app/me`);
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    if (res.status === 401) {
      redirect('/auth/login');
    }
    throw new Error(res.statusText);
  }
  return await res.json() as AuthUserDto;
}

export const getToDos = async () => {
  const res = await fetcher('GET', `/app/me/to-do`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as ToDoDto[];
}

export const getNotifications = async () => {
  const res = await fetcher('GET', `/app/me/notification`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as UserNotificationDto[];
}


export const updateProfile = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  healthQ1: string;
  healthQ2: string;
  healthQ3: string;
  healthQ4: string;
  healthQ5: string[];
  healthQ5Other?: string;
}) => {
  const res = await fetcher('PUT', `/user/me`, payload);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
}

export const updateProfilePic = async (payload: {
  filename: string;
  contentType: string;
  data: string;
}) => {
  const res = await fetcher('PUT', `/app/me/profile-pic`, payload);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
}

export const updateClothesSize = async (size: string) => {
  const res = await fetcher('PUT', `/app/me/clothes-size`, { size });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
}

