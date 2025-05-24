import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Goal } from 'src/goal/entities/goal.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: string; // e.g., 'employee', 'manager', 'hr'

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Skill, (skill) => skill.user)
  skills: Skill[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
