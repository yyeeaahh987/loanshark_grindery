import React, { useState } from "react";
import { CircularProgress } from "grindery-ui";
import WorkflowBuilder from './workflow/WorkflowBuilder'
// import WorkflowStep from "../../workflow/WorkflowStep";
// import useAppContext from "../../hooks/useAppContext";
// import { useMatch } from "react-router";
// import WorkflowContainer from "../workflow/WorkflowContainer";

type Props = {};

const ForkPageMain = (props: Props) => {
    //   const { connectors } = useAppContext();

    //   const isMatchingWorkflowNew = useMatch("/workflows/new");
    //   const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
    //   const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;

    //   if (!connectors || !connectors.length) {
    //     return (
    //       <div style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}>
    //         <CircularProgress color="inherit" />
    //       </div>
    //     );
    //   }

    //   if (!matchNewWorfklow) {
    //     return null;
    //   }

    //   return <WorkflowContainer />;

    
      // workflow steps output
  const [outputFields, setOutputFields] = useState<any[]>([]);
  const [workflow, setWorkflow] = useState<any>()
    return (
        <>
        this is fork page
        <WorkflowBuilder></WorkflowBuilder>
            {/* <WorkflowStep outputFields={outputFields} /> */}
        </>
    )
};

export default ForkPageMain;









// const ForkPageMain = (props: Props) => {
//     //   const { connectors } = useAppContext();

//     //   const isMatchingWorkflowNew = useMatch("/workflows/new");
//     //   const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
//     //   const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;

//     //   if (!connectors || !connectors.length) {
//     //     return (
//     //       <div style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}>
//     //         <CircularProgress color="inherit" />
//     //       </div>
//     //     );
//     //   }

//     //   if (!matchNewWorfklow) {
//     //     return null;
//     //   }

//     //   return <WorkflowContainer />;
// };

// export default ForkPageMain;
