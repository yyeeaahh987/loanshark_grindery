import React, { useState } from "react";
import styled from "styled-components";
// import useWorkflowContext from "../../hooks/useWorkflowContext";
import { SCREEN } from "../../constants";
import WorkflowStep from '../../Fork/workflow/WorkflowStep'
// import WorkflowStep from "./WorkflowStep";
// import WorkflowStepContextProvider from "../../context/WorkflowStepContext";
// import WorkflowName from "./WorkflowName";
// import WorkflowSave from "./WorkflowSave";
// import WorkflowState from "./WorkflowState";

const Wrapper = styled.div`
  max-width: 816px;
  padding: 32px 20px 42px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  jsutify-content: flex-start;
  flex-wrap: nowrap;
  margin: 0 auto;
  padding: 0 16px 16px;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0 0 16px;
    margin: 40px auto 0;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 40px auto 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 0 0 16px;
    margin: 40px auto 0;
  }
`;

type Props = {};

const WorkflowBuilder = (props: Props) => {
    //   const { workflow } = useWorkflowContext();
    //   console.log(`workflow`,workflow)
    // workflow steps output
    const [outputFields, setOutputFields] = useState<any[]>([]);
    // const [workflow, setWorkflow] = useState<any>(
    //     {
    //         "title": "Name your workflow",
    //         "trigger": {
    //             "type": "trigger",
    //             "connector": "",
    //             "operation": "",
    //             "input": {}
    //         },
    //         "actions": [
    //             {
    //                 "type": "action",
    //                 "connector": "",
    //                 "operation": "",
    //                 "input": {}
    //             },
    //             {
    //                 "type": "action",
    //                 "connector": "",
    //                 "operation": "",
    //                 "input": {}
    //             }
    //         ],
    //         "creator": "eip155:1:0xD8649AaeBc1Bd65714159f3b5626A4699D0eB7eC",
    //         "state": "off",
    //         "source": "urn:grindery-staging:nexus",
    //         "system": {
    //             "actions": [
    //                 {
    //                     "selected": false,
    //                     "authenticated": false,
    //                     "configured": true,
    //                     "tested": false
    //                 },
    //                 {
    //                     "selected": false,
    //                     "authenticated": false,
    //                     "configured": true,
    //                     "tested": false
    //                 }
    //             ]
    //         }
    //     }
    // );
    const [workflow, setWorkflow] = useState<any>(
        {
            "title": "Name your workflow",
            "trigger": {
                "type": "trigger",
                "connector": "",
                "operation": "",
                "input": {}
            },
            "actions": [
                {
                    "type": "action",
                    "connector": "",
                    "operation": "",
                    "input": {}
                },
                {
                    "type": "action",
                    "connector": "",
                    "operation": "",
                    "input": {}
                },
                {
                    "type": "action",
                    "connector": "discord",
                    "operation": "sendChannelMessage",
                    "input": {}
                },
                {
                    "type": "action",
                    "connector": "nftmints",
                    "operation": "evmMint",
                    "input": {
                        "_grinderyGasLimit": "0.001",
                        "_grinderyContractAddress": "0xd3577853504823DfFE231534bE22bfD55939A559",
                        "recipient": "0xFd59c38a4ce323062b75B3fb35C1d146F445c1Ec",
                        "name": "test name",
                        "description": "test description",
                        "image": "https://ipfs.io/ipfs/QmTgqnhFBMkfT9s8PHKcdXBn1f5bG3Q5hmBaR4U6hoTvb1?filename=Chainlink_Elf.png"
                    }
                },
                {
                    "type": "action",
                    "connector": "flow",
                    "operation": "transferFlowToken",
                    "input": {}
                }
            ],
            "creator": "eip155:1:0xD8649AaeBc1Bd65714159f3b5626A4699D0eB7eC",
            "state": "off",
            "source": "urn:grindery-staging:nexus",
            "system": {
                "actions": [
                    {
                        "selected": false,
                        "authenticated": false,
                        "configured": true,
                        "tested": false
                    },
                    {
                        "selected": false,
                        "authenticated": false,
                        "configured": true,
                        "tested": false
                    },
                    {
                        "selected": true,
                        "authenticated": false,
                        "configured": true,
                        "tested": false
                    },
                    {
                        "selected": true,
                        "authenticated": true,
                        "configured": true,
                        "tested": false
                    },
                    {
                        "selected": true,
                        "authenticated": false,
                        "configured": false,
                        "tested": false
                    }
                ]
            }
        }
    );
    const [activeStep, setActiveStep] = useState<number | string>(0)
    return (
        <>
            this is workflow builder
            <Wrapper>
                {/* this is default action trigger */}
                <WorkflowStep
                    type={'trigger'}
                    activeStep={activeStep}
                    outputFields={outputFields}
                >
                </WorkflowStep>
                {workflow.actions.map((action: any, index: any) => {
                    return (
                        <>
                            <WorkflowStep
                                // workflowState={[workflow, setWorkflow]}
                                step={index+1}
                                type={action.type}
                                activeStep={activeStep}
                                outputFields={outputFields}
                            ></WorkflowStep>
                        </>
                    )
                })}
            </Wrapper>
        </>
    );
};

export default WorkflowBuilder;




//    {/* top bar haed
//       <WorkflowName />
//       {/* top bar on/off */}
//       <WorkflowState />
//       {/* middle form */}
//       <Wrapper>
//         <WorkflowStepContextProvider
//           type="trigger"
//           index={0}
//           step={1}
//           setOutputFields={setOutputFields}
//         >
//           <WorkflowStep outputFields={outputFields} />
//         </WorkflowStepContextProvider>
//         {workflow.actions.map((action, index) => (
//           <WorkflowStepContextProvider
//             key={`${action.connector}_${index}`}
//             type="action"
//             index={index}
//             step={index + 2}
//             setOutputFields={setOutputFields}
//           >
//             <WorkflowStep outputFields={outputFields} />
//           </WorkflowStepContextProvider>
//         ))}
//         <WorkflowSave />
//       </Wrapper>
