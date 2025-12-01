import {invoke} from '@tauri-apps/api/core';

export interface Video {
    id: number;
    uuid: string;
    path: string;
    title?: string | null;
    duration?: number | null;
    rating?: number | null;
    watch_count: number;
    favorite?: number | null;
}

export class Api {
    openFileDialog(): Promise<string> {
        return invoke('open_file_dialog') as Promise<string>;
    }

    listVideos(): Promise<Video[]> {
        return invoke('list_videos') as Promise<Video[]>;
    }

    listRecent(limit?: number, offset?: number): Promise<Video[]> {
        return invoke('list_recent', { limit: limit ?? null, offset: offset ?? null }) as Promise<Video[]>;
    }

    listFavorites(): Promise<Video[]> {
        return invoke('list_favorites') as Promise<Video[]>;
    }

    listFavoritesPaginated(limit?: number, offset?: number): Promise<Video[]> {
        return invoke('list_favorites', { limit: limit ?? null, offset: offset ?? null }) as Promise<Video[]>;
    }

    pickFolder(): Promise<string | null> {
        return invoke('pick_folder') as Promise<string | null>;
    }

    readDirRecursive(path: string): Promise<string[]> {
        return invoke('read_dir_recursive', { path }) as Promise<string[]>;
    }

    addVideo(path: string, title?: string | null, duration?: number | null): Promise<Video> {
        return invoke('add_video', { path, title, duration }) as Promise<Video>;
    }

    greet(name: string): Promise<string> {
        return invoke('greet', { name }) as Promise<string>;
    }

    getVideo(id: number): Promise<Video | null> {
        return invoke('get_video', { id }) as Promise<Video | null>;
    }

    getVideoByPath(path: string): Promise<Video | null> {
        return invoke('get_video_by_path', { path }) as Promise<Video | null>;
    }

    incrementView(id: number): Promise<void> {
        return invoke('increment_view', { id }) as Promise<void>;
    }

    addLike(id: number): Promise<void> {
        return invoke('add_like', { id }) as Promise<void>;
    }

    addRating(id: number, rating: number): Promise<void> {
        return invoke('add_rating', { id, rating }) as Promise<void>;
    }

    updateVideoDurationByPath(path: string, duration: number): Promise<void> {
        return invoke('update_video_duration_by_path', { path, duration }) as Promise<void>;
    }

    deleteVideo(id: number): Promise<void> {
        return invoke('delete_video', { id }) as Promise<void>;
    }

    setFavorite(id: number, favorite: boolean): Promise<void> {
        return invoke('set_favorite', { id, favorite }) as Promise<void>;
    }

    confirmDialog(title: string, message: string): Promise<boolean> {
        return invoke('confirm_dialog', { title, message }) as Promise<boolean>;
    }
}
