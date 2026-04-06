import TaskTable from "../components/TaskTable";

export default function TaskList({ tasks }) {
  return (
    <div>
      <h3 className="title">All Tasks</h3>
      <TaskTable tasks={tasks} showAssignee />
    </div>
  );
}

