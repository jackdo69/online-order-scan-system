#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OnlineOrderScanSystemStack } from "../lib/online-order-scan-system-stack";

const app = new cdk.App();
new OnlineOrderScanSystemStack(app, "OnlineOrderScanSystemStack", {});
