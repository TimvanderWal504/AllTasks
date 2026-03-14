export interface List {
  id: string;
  ownerId: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface CreateListRequest {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateListRequest {
  name?: string;
  color?: string;
  icon?: string;
}
