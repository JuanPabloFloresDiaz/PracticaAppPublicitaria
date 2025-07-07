import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
    DeleteDateColumn, ManyToOne, JoinColumn
} from 'typeorm';

@Entity('campaign_news')
export class CampaignNews {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    campaign_id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    subtitle: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    hero_image: string;

    @Column({ type: 'jsonb', nullable: true })
    tags: Record<string, any>;

    @Column({ type: 'boolean', default: false })
    is_public: boolean;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    author: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at: Date;

    @ManyToOne('Campaign', 'news', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaign_id' })
    campaign: any;
}