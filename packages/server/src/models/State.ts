import mongoose, { Schema, Document } from 'mongoose';

const StateSchema: Schema = new Schema({
  questionCount: { required: true, type: Number },
  happiness: { required: true, type: Number },
});

export interface State extends Document {
  questionCount: number;
  happiness: number;
}

export default mongoose.model<State>('State', StateSchema);
