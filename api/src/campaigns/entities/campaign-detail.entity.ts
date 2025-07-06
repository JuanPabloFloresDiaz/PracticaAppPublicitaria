import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('campaign_details')
export class CampaignDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  campaign_id: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  extra_info: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date;

  @ManyToOne('Campaign', 'details', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaign_id' })
  campaign: any;
}