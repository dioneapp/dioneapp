export interface Script {
	id: string;
	name: string;
	description: string;
	logo_url?: string;
	likes: number;
	tags: string[];
	downloads: number;
	created_at?: string;
	updated_at?: string;
	banner_url?: string;
	isLocal?: boolean;
	official?: boolean;
	version?: string;
	order?: string;
}
